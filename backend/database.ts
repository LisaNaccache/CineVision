import oracledb = require('oracledb');


let pool: oracledb.Pool;

export async function initDB() {
    pool = await oracledb.createPool({
        user: 'SYSTEM',
        password: 'root',
        connectString: 'localhost:1521/XE',
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1
    });
}

export async function executeQuery(query: any, params = {}) {

    let connection: oracledb.Connection;
    try {
        connection = await pool.getConnection();
        return await connection.execute(query, params);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
