import { DataTypes } from 'sequelize';
import sequelize from '../database';
import LearningPackage from './LearningPackage';

const LearningFact = sequelize.define('LearningFact', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    timesReviewed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    confidenceLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    lastReviewedDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

LearningPackage.hasMany(LearningFact, { foreignKey: 'packageId', as: 'facts' });
LearningFact.belongsTo(LearningPackage, { foreignKey: 'packageId', as: 'package' });

export default LearningFact;