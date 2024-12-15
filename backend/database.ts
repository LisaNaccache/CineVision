import oracledb = require('oracledb');

let pool: oracledb.Pool;

export async function initDB() {
    pool = await oracledb.createPool({
        user: 'SYSTEM',
        password: 'Poisson86+',
        connectString: 'localhost:1521/XE',
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
    });
    console.log('Base de données initialisée.');
}

export async function executeQuery(query: string, params = {}): Promise<any> {
    let connection: oracledb.Connection | undefined;
    try {
        connection = await pool.getConnection();
        const result = await connection.execute(query, params, { autoCommit: true }); // Auto-commit activé
        return result;
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête :', err.message);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}