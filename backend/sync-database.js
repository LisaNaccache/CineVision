"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./database");
var LearningPackage_1 = require("./models/LearningPackage");
var LearningFact_1 = require("./models/LearningFact");
console.log('Modèle enregistré :', LearningPackage_1.default === database_1.default.models.LearningPackage);
console.log('Modèle enregistré :', LearningFact_1.default === database_1.default.models.LearningFact);
database_1.default.sync({ force: true }) // `force: true` recree les tables a chaque execution
    .then(function () {
    console.log('Les tables ont été synchronisées avec succès.');
    process.exit(0);
})
    .catch(function (err) {
    console.error('Erreur lors de la synchronisation des tables :', err);
    process.exit(1);
});
