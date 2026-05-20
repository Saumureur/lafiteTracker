import dotenv from 'dotenv';
dotenv.config();

console.log('my URL')
console.log(process.env.DATABASE_URL)
export default {
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};