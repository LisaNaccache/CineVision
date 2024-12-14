import sequelize from './database';

sequelize.authenticate()
    .then(() => {
        console.log('Connexion réussie à la base LearningFactDb.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Erreur de connexion :', err);
        process.exit(1);
    });