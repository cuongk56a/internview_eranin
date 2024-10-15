import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { onConnetCallback } from "./redis";
import { appConfigs } from './config/config';

declare global {
  let __basedir: string;
  namespace Express {
    interface Request {
      userId: any;
    }
  }
}

const server = http.createServer(app);

onConnetCallback(() => {
  console.log('Redis Connect Success!');
  mongoose
    .connect(appConfigs.mongoose.url)
    .then(async () => {
      console.info('Connected to MongoDB');
      server.listen(appConfigs.port, async () => {
      });
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  server.close();
});