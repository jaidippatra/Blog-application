import fs from "fs";
import pg from "pg";

const config = {
    user: "avnadmin",
    password: "AVNS_rlBFNc7OJiP3iAJANMN",
    host: "pg-blog-blog-application.c.aivencloud.com",
    port: 24328,
    database: "blog",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./ca.pem").toString(),
    },
};

const client = new pg.Client(config);
export default client;