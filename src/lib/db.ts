import pg from 'pg';
import { Sequelize } from 'sequelize';

const connectionString = process.env.DATABASE_URL || '';

export const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectModule: pg
});