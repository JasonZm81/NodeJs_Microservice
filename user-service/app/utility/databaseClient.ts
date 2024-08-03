import { Client } from "pg";

export const DBClient = () => {
  return new Client({
    host: "127.0.0.1",
    user: "root",
    database: "user_service",
    password: "root",
    port: 5432,
  });
};

/*
self managed  host: "ec2-3-71-187-16.eu-central-1.compute.amazonaws.com", 
aws managed host: "user-service.cayrxletla8g.eu-central-1.rds.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "user_service#2023",
    port: 5432,
*/
