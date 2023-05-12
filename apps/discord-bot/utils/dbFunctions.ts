import "reflect-metadata";
import { createConnection } from "typeorm";
import Server from "../entities/Server";
export function connectDatabase() {
    return createConnection({
        "type": "postgres",
        "host": process.env.DATABASE_HOST as string,
        "port": parseInt(process.env.DATABASE_PORT as string),
        "username": process.env.DATABASE_USERNAME as string,
        "password": process.env.DATABASE_PASSWORD as string,
        "database": process.env.DATABASE_NAME as string,
        "synchronize": false,
        "logging": true,
        "entities": [
           Server
        ]
    })
}