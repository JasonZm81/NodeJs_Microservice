import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export const DBClient = () => {
  return new Client({
    host: "ec2-54-81-11-246.compute-1.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "user_service123",
    port: 5432,
  });
};
