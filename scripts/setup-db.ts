// Creates and seeds the Students table in DynamoDB Local.
// Run with: npm run db:setup  (the app also does this itself if the table is missing)
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { setupDb } from '../app/lib/setupDb.ts';

try {
  await setupDb(new DynamoDBClient({ endpoint: process.env.DYNAMODB_ENDPOINT }));
  console.log('DynamoDB setup complete');
} catch (err) {
  console.error(`DynamoDB setup failed (is DynamoDB Local running on ${process.env.DYNAMODB_ENDPOINT}?)`);
  console.error((err as Error).message);
  process.exit(1);
}
