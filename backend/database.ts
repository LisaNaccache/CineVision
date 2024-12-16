import oracledb = require('oracledb');


let pool: oracledb.Pool;
// Here we initialize the OracleDB connection pool.
export async function initDB() {
    pool = await oracledb.createPool({
        user: 'SYSTEM', // Change accoring to your oracle user
        password: 'Poisson86+', // same for oracle password
        connectString: 'localhost:1521/XE',
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1 // Just in case: number of connections to add when the pool is exhausted
    });
}

export async function executeQuery(query: string, params = {}) {
    let connection: oracledb.Connection;
    try {
        //get a connection from the pool
        connection = await pool.getConnection();
        return await connection.execute(query, params, { autoCommit: true }); //Autocommit essential to update the databse
    } finally {
        if (connection) {
            //we have to ensure connection is closed
            await connection.close();
        }
    }
}