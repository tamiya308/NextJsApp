// Creates the Students table if it doesn't exist, then seeds it if it's empty.
// Shared by the app (self-heals when the table is missing) and scripts/setup-db.ts.
// No 'server-only' import here, because the plain Node script imports this file too.
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  ResourceNotFoundException,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand, DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const TABLE = 'Students';

const SEED_STUDENTS = [
  { StudentId: 'S001', EnrolmentDate: '2022-02-14', FullName: 'Olivia Bennett',  DOB: '2003-05-12', IsActive: true },
  { StudentId: 'S002', EnrolmentDate: '2022-02-14', FullName: 'Liam Carter',     DOB: '2002-11-03', IsActive: false },
  { StudentId: 'S003', EnrolmentDate: '2022-07-18', FullName: 'Ava Thompson',    DOB: '2004-01-27', IsActive: true },
  { StudentId: 'S004', EnrolmentDate: '2023-02-13', FullName: 'Noah Patel',      DOB: '2003-08-09', IsActive: true },
  { StudentId: 'S005', EnrolmentDate: '2023-02-13', FullName: 'Mia Nguyen',      DOB: '2005-03-21', IsActive: true },
  { StudentId: 'S006', EnrolmentDate: '2023-07-17', FullName: 'Ethan Walker',    DOB: '2004-12-30', IsActive: false },
  { StudentId: 'S007', EnrolmentDate: '2024-02-12', FullName: 'Isla Murphy',     DOB: '2005-06-14', IsActive: true },
  { StudentId: 'S008', EnrolmentDate: '2024-02-12', FullName: 'Lucas Kim',       DOB: '2006-02-08', IsActive: true },
  { StudentId: 'S009', EnrolmentDate: '2024-07-15', FullName: 'Grace Robinson',  DOB: '2005-09-19', IsActive: false },
  { StudentId: 'S010', EnrolmentDate: '2024-07-15', FullName: 'Jack Wilson',     DOB: '2006-04-02', IsActive: true },
];

async function ensureTable(client: DynamoDBClient) {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE }));
    return;
  } catch (err) {
    if (!(err instanceof ResourceNotFoundException)) throw err;
  }

  try {
    await client.send(new CreateTableCommand({
      TableName: TABLE,
      KeySchema: [
        { AttributeName: 'StudentId', KeyType: 'HASH' },
        { AttributeName: 'EnrolmentDate', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'StudentId', AttributeType: 'S' },
        { AttributeName: 'EnrolmentDate', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }));
    console.log(`Created table "${TABLE}"`);
  } catch (err) {
    // Another process created it first
    if (!(err instanceof ResourceInUseException)) throw err;
  }
  await waitUntilTableExists({ client, maxWaitTime: 30 }, { TableName: TABLE });
}

async function seedIfEmpty(db: DynamoDBDocumentClient) {
  const { Count } = await db.send(new ScanCommand({ TableName: TABLE, Limit: 1, Select: 'COUNT' }));
  if (Count) return;

  let requests = SEED_STUDENTS.map((Item) => ({ PutRequest: { Item } }));
  while (requests.length > 0) {
    const res = await db.send(new BatchWriteCommand({ RequestItems: { [TABLE]: requests } }));
    requests = (res.UnprocessedItems?.[TABLE] ?? []) as typeof requests;
  }
  console.log(`Seeded ${SEED_STUDENTS.length} students`);
}

export async function setupDb(client: DynamoDBClient) {
  await ensureTable(client);
  await seedIfEmpty(DynamoDBDocumentClient.from(client));
}
