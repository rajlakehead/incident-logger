import { sequelize } from "./db";

async function syncDb() {
  try {
    await sequelize.sync({ alter: true }); // alter:true to update tables without dropping
    console.log('Database synced!');
  } catch (err) {
    console.error('Sync error:', err);
  }
}

syncDb();