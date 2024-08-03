"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const pg_1 = require("pg");
const DBClient = () => {
    return new pg_1.Client({
        host: "127.0.0.1",
        user: "root",
        database: "user_service",
        password: "root",
        port: 5432,
    });
};
exports.DBClient = DBClient;
/*
self managed  host: "ec2-3-71-187-16.eu-central-1.compute.amazonaws.com",
aws managed host: "user-service.cayrxletla8g.eu-central-1.rds.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "user_service#2023",
    port: 5432,
*/
//# sourceMappingURL=databaseClient.js.map