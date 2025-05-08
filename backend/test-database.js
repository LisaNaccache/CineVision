"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
database_1.default.authenticate()
    .then(() => {
    console.log('Connexion réussie à la base LearningFactDb.');
    process.exit(0);
})
    .catch(err => {
    console.error('Erreur de connexion :', err);
    process.exit(1);
});
