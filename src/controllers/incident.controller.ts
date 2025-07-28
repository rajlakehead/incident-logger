import { Request, Response } from 'express';
import Incident from '../models/incident';
//import { summarizeText } from '../services/openai.service';

export const createIncident = async (req: Request, res: Response) => {
  const { type, description } = req.body;
  const userId = req.user?.uid;

  if (!type || !description) return res.status(400).send('Missing fields');

  //const incident = await Incident.create({ userId, type, description });
  //res.status(201).json(incident);
};

export const getIncidents = async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  const incidents = await Incident.findAll({ where: { userId } });
  res.json(incidents);
};

export const summarizeIncident = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.uid;

  const incident = await Incident.findByPk(id);
  if (!incident || incident.userId !== userId) return res.status(404).send('Not found');

  const summary = "";//await summarizeText(incident.description);
  incident.summary = summary;
  await incident.save();

  res.json(incident);
};
