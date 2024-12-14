"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('LearningFactDb', 'learningDbUser', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});
// Tester la connexion
sequelize.authenticate()
    .then(function () { return console.log('Connexion à PostgreSQL réussie.'); })
    .catch(function (err) { return console.error('Impossible de se connecter :', err); });
exports.default = sequelize;
