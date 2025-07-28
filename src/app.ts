import express from 'express';
import incidentsRouter from './routes/incidents';
import { sequelize } from './lib/db';


const app = express();
app.use(express.json());

app.use('/incidents', incidentsRouter);

sequelize.sync();

export default app;
