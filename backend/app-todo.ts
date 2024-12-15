import * as express from 'express';
import {Request, Response} from 'express';
import swaggerJsdoc = require('swagger-jsdoc'); // * as swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi = require('swagger-ui-express');
import { executeQuery, initDB } from './database'; // import the helper from database.ts

const cors = require('cors');

const app = express();
app.use(express.json()); // => to parse request body with http header "content-type": "application/json"
app.use(cors())


const jsDocOptions = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Cinevision API',
            version: '1.0.0',
            description: 'API for managing movies in Cinevision',
        },
        components: {
            schemas: {
                Film: {
                    type: 'object',
                    properties: {
                        id_film: { type: 'integer' },
                        title: { type: 'string' },
                        original_language: { type: 'string' },
                        overview: { type: 'string' },
                        popularity: { type: 'number' },
                        release_date: { type: 'string', format: 'date' },
                        runtime: { type: 'number' },
                        status: { type: 'string' },
                        vote_count: { type: 'integer' },
                        vote_average: { type: 'number' },
                        link_poster: { type: 'string' },
                        link_trailer: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['app-todo.js'],
};


const apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null, 2));

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));

app.get('/api/liveness', (req: Request, res: Response) => {
    res.send('OK !!!');
});



interface Film {
    id_film?: number;
    title: string;
    original_language?: string;
    overview?: string;
    popularity?: number;
    release_date?: string;
    runtime?: number;
    status?: string;
    vote_count?: number;
    vote_average?: number;
    link_poster?: string;
    link_trailer?: string;
}


// ---------------------------------------
//              CRUD FILM
// ---------------------------------------

// GET ALL FILMS
/**
 * @openapi
 * /api/films:
 *   get:
 *     description: Get all films
 *     responses:
 *       200:
 *         description: An array of Film
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 */
app.get('/api/films', async (req: Request, res: Response) => {
    try {
        const result = await executeQuery('SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE, LINK_POSTER, LINK_TRAILER FROM FILM');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des films :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/films/{id}:
 *   get:
 *     description: Get a film by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Film to get
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: The requested Film object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       404:
 *         description: Film not found
 */
app.get('/api/films/:id', async (req: Request, res: Response) => {
    try {
        console.log('start');
        const id = +req.params.id;

        const result = await executeQuery(`
            SELECT ID_FILM,
                   TITLE,
                   ORIGINAL_LANGUAGE,
                   OVERVIEW,
                   POPULARITY,
                   RELEASE_DATE,
                   RUNTIME,
                   STATUS,
                   VOTE_COUNT,
                   VOTE_AVERAGE,
                   LINK_POSTER,
                   LINK_TRAILER
            FROM FILM
            WHERE ID_FILM = :id
        `, {id});

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({error: `Film not found with ID: ${id}`});
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du film :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// POST NEW FILM (sans ID, génération via séquence)
/**
 * @openapi
 * /api/films:
 *   post:
 *     description: Add a new film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       201:
 *         description: The created Film object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 */
app.post('/api/films', async (req: Request, res: Response) => {
    try {
        const newFilm: Film = req.body;

        // Exécutez la requête
        const insertResult = await executeQuery(
            `
                INSERT INTO FILM
                (TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE, LINK_POSTER, LINK_TRAILER)
                VALUES
                    (:title, :original_language, :overview, :popularity, TO_DATE(:release_date, 'YYYY-MM-DD'), :runtime, :status, :vote_count, :vote_average, :link_poster, :link_trailer)
                    RETURNING ID_FILM INTO :id_film
            `,
            {
                title: newFilm.title,
                original_language: newFilm.original_language || null,
                overview: newFilm.overview || null,
                popularity: newFilm.popularity || null,
                release_date: newFilm.release_date || null,
                runtime: newFilm.runtime || null,
                status: newFilm.status || null,
                vote_count: newFilm.vote_count || null,
                vote_average: newFilm.vote_average || null,
                link_poster: newFilm.link_poster || null,
                link_trailer: newFilm.link_trailer || null,
                id_film: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
            }
        ) as { outBinds: { id_film: number[] } };

        // Extraire l'ID généré
        newFilm.id_film = insertResult.outBinds.id_film[0];

        // Répondre avec le film créé
        res.status(201).json(newFilm);
    } catch (err) {
        console.error('Erreur lors de la création du film :', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});






// app.patch()

console.log('starting...');
(async () => {
    try {
        await initDB(); // Call initDB here
        app.listen(3000, () => {
            console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
        });
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1); // Exit if DB init fails
    }
})();

/*
app.listen(3000, () => {
    console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
});

*/
