import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/lib/db'; // Adjust the import path as necessary

interface IncidentAttributes {
  id?: number;
  userId: string;
  type: string;
  description: string;
  summary?: string;
}

interface IncidentCreationAttributes extends Optional<IncidentAttributes, 'id' | 'summary'> {}

class Incident extends Model<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
  public id!: number;
  public userId!: string;
  public type!: string;
  public description!: string;
  public summary?: string;
}

Incident.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Add other fields as needed
  },
  {
    sequelize,
    modelName: 'Incident',
  }
);

export default Incident;