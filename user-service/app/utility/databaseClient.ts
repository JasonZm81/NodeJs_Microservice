import { Client } from "pg";

export const DBClient = () => {
  // return new Client({
  //   host: "ec2-107-23-226-59.compute-1.amazonaws.com",
  //   user: "user_service",
  //   database: "user_service",
  //   password: "user_service123",
  //   port: 5432,
  // });
  return new Client({
    user: "root",
    host: "127.0.0.1",
    database: "user_service",
    password: "root",
    port: 5432,
  });
};
