import serverless from 'serverless-http';
import mongoose from 'mongoose';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import app from './app';
import { connectDB } from './config/database';

const handler = serverless(app);

export const api = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  return handler(event, context);
};
