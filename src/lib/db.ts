import pg from 'pg';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgresql://neondb_owner:npg_b2tShYprPH6B@ep-billowing-king-aeqt7n2c-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require', {
  dialect: 'postgres',
  dialectModule: pg
});