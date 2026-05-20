import dotenv from 'dotenv';
dotenv.config();

export default {
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};