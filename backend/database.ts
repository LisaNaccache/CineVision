import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('LearningFactDb', 'learningDbUser', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});

// Tester la connexion
sequelize.authenticate()
    .then(() => console.log('Connexion à PostgreSQL réussie.'))
    .catch(err => console.error('Impossible de se connecter :', err));

export default sequelize;
