import 'server-only';
import { DynamoDBClient, ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { setupDb } from './setupDb';

export const STUDENTS_TABLE = 'Students';

export interface Student {
  StudentId: string;      // partition key
  EnrolmentDate: string;  // sort key, ISO date (YYYY-MM-DD)
  FullName: string;
  DOB: string;            // ISO date (YYYY-MM-DD)
  IsActive: boolean;
}

const client = new DynamoDBClient({ endpoint: process.env.DYNAMODB_ENDPOINT });
const db = DynamoDBDocumentClient.from(client);

// DynamoDB Local runs in memory, so the table disappears whenever the container restarts.
// If it's missing, recreate and reseed it once, then retry the operation.
let setupInProgress: Promise<void> | null = null;

async function withTable<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    if (!(err instanceof ResourceNotFoundException)) throw err;
    setupInProgress ??= setupDb(client).finally(() => { setupInProgress = null; });
    await setupInProgress;
    return operation();
  }
}

export async function getStudents(): Promise<Student[]> {
  const students: Student[] = [];
  let startKey: Record<string, unknown> | undefined;
  do {
    const res = await withTable(() => db.send(new ScanCommand({
      TableName: STUDENTS_TABLE,
      ExclusiveStartKey: startKey,
    })));
    students.push(...(res.Items as Student[] ?? []));
    startKey = res.LastEvaluatedKey;
  } while (startKey);

  // Scan order is arbitrary, so sort to keep pagination stable
  return students.sort((a, b) => a.StudentId.localeCompare(b.StudentId));
}

// Returns the student's most recent enrolment, or null if the student doesn't exist
export async function getStudent(studentId: string): Promise<Student | null> {
  const res = await withTable(() => db.send(new QueryCommand({
    TableName: STUDENTS_TABLE,
    KeyConditionExpression: 'StudentId = :id',
    ExpressionAttributeValues: { ':id': studentId },
    ScanIndexForward: false,
    Limit: 1,
  })));
  return (res.Items?.[0] as Student | undefined) ?? null;
}

export async function setStudentActive(studentId: string, enrolmentDate: string, isActive: boolean): Promise<void> {
  await withTable(() => db.send(new UpdateCommand({
    TableName: STUDENTS_TABLE,
    Key: { StudentId: studentId, EnrolmentDate: enrolmentDate },
    UpdateExpression: 'SET IsActive = :isActive',
    // Without this, updating a key that doesn't exist would create a new, incomplete record
    ConditionExpression: 'attribute_exists(StudentId)',
    ExpressionAttributeValues: { ':isActive': isActive },
  })));
}
