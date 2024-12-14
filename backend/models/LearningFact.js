"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var database_1 = require("../database");
var LearningPackage_1 = require("./LearningPackage");
var LearningFact = database_1.default.define('LearningFact', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    timesReviewed: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    confidenceLevel: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    lastReviewedDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
});
LearningPackage_1.default.hasMany(LearningFact, { foreignKey: 'packageId', as: 'facts' });
LearningFact.belongsTo(LearningPackage_1.default, { foreignKey: 'packageId', as: 'package' });
exports.default = LearningFact;
