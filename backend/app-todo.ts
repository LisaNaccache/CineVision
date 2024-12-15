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

                Genre: {
                    type: 'object',
                    properties: {
                        id_genre: { type: 'integer' },
                        name_genre: { type: 'string' },
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




// ---------------------------------------
//                  FILM
// ---------------------------------------

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
        const result = await executeQuery('SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE, LINK_POSTER, LINK_TRAILER FROM FILM ORDER BY TITLE');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des films :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

// GET FILM ID
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

// POST NEW FILM (sans ID)
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


// PUT (Update a film without specifying id in the path)
/**
 * @openapi
 * /api/films:
 *   put:
 *     description: Update an existing film without specifying id in the path
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       200:
 *         description: The updated Film object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       400:
 *         description: Bad Request - ID not provided in the body
 *       404:
 *         description: Film not found
 */
app.put('/api/films', async (req: Request, res: Response) => {
    try {
        const updatedFilm: Film = req.body;

        if (!updatedFilm.id_film) {
            res.status(400).json({ error: 'ID is required in the body to update a film.' });
            return;
        }

        const result = await executeQuery(
            `
                UPDATE FILM
                SET TITLE = :title,
                    ORIGINAL_LANGUAGE = :original_language,
                    OVERVIEW = :overview,
                    POPULARITY = :popularity,
                    RELEASE_DATE = TO_DATE(:release_date, 'YYYY-MM-DD'),
                    RUNTIME = :runtime,
                    STATUS = :status,
                    VOTE_COUNT = :vote_count,
                    VOTE_AVERAGE = :vote_average,
                    LINK_POSTER = :link_poster,
                    LINK_TRAILER = :link_trailer
                WHERE ID_FILM = :id_film
            `,
            {
                id_film: updatedFilm.id_film,
                title: updatedFilm.title,
                original_language: updatedFilm.original_language || null,
                overview: updatedFilm.overview || null,
                popularity: updatedFilm.popularity || null,
                release_date: updatedFilm.release_date || null,
                runtime: updatedFilm.runtime || null,
                status: updatedFilm.status || null,
                vote_count: updatedFilm.vote_count || null,
                vote_average: updatedFilm.vote_average || null,
                link_poster: updatedFilm.link_poster || null,
                link_trailer: updatedFilm.link_trailer || null,
            }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({ error: `Film not found with ID: ${updatedFilm.id_film}` });
        } else {
            res.status(200).json({ message: 'Film updated successfully', updatedFilm });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du film :', err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});


// DELETE (Delete a film by id)
/**
 * @openapi
 * /api/films/{id}:
 *   delete:
 *     description: Delete a film by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Film to delete
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Film deleted successfully
 *       404:
 *         description: Film not found
 */
app.delete('/api/films/:id', async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(
            `
                DELETE FROM FILM
                WHERE ID_FILM = :id
            `,
            { id }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({ error: `Film not found with ID: ${id}` });
        } else {
            res.status(200).json({ message: 'Film deleted successfully' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du film :', err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});











// ---------------------------------------
//                  GENRE
// ---------------------------------------

interface Genre {
    id_genre?: number;
    name_genre: string;
}

// GET ALL GENRES
/**
 * @openapi
 * /api/genres:
 *   get:
 *     description: Get all genres
 *     responses:
 *       200:
 *         description: An array of Genre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 */
app.get('/api/genres', async (req: Request, res: Response) => {
    try {
        const result = await executeQuery('SELECT ID_GENRE, NAME_GENRE FROM GENRE');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des genres :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// GET GENRE ID
/**
 * @openapi
 * /api/genres/{id}:
 *   get:
 *     description: Get a genre by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Genre to get
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: The requested Genre object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
 */
app.get('/api/genres/:id', async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(`
            SELECT ID_GENRE, NAME_GENRE
            FROM GENRE
            WHERE ID_GENRE = :id
        `, {id});

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({error: `Genre not found with ID: ${id}`});
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du genre :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// POST NEW GENRE
/**
 * @openapi
 * /api/genres:
 *   post:
 *     description: Add a new genre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       201:
 *         description: The created Genre object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 */
app.post('/api/genres', async (req: Request, res: Response) => {
    try {
        const newGenre: Genre = req.body;

        const insertResult = await executeQuery(
            `
                INSERT INTO GENRE
                (NAME_GENRE)
                VALUES
                    (:name_genre)
                RETURNING ID_GENRE INTO :id_genre
            `,
            {
                name_genre: newGenre.name_genre,
                id_genre: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
            }
        ) as { outBinds: { id_genre: number[] } };

        newGenre.id_genre = insertResult.outBinds.id_genre[0];

        res.status(201).json(newGenre);
    } catch (err) {
        console.error('Erreur lors de la création du genre :', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});


// PUT (Update GENRE)
/**
 * @openapi
 * /api/genres:
 *   put:
 *     description: Update an existing genre without specifying id in the path
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: The updated Genre object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Bad Request - ID not provided in the body
 *       404:
 *         description: Genre not found
 */
app.put('/api/genres', async (req: Request, res: Response) => {
    try {
        const updatedGenre: Genre = req.body;

        if (!updatedGenre.id_genre) {
            res.status(400).json({ error: 'ID is required in the body to update a genre.' });
            return;
        }

        const result = await executeQuery(
            `
                UPDATE GENRE
                SET NAME_GENRE = :name_genre
                WHERE ID_GENRE = :id_genre
            `,
            {
                id_genre: updatedGenre.id_genre,
                name_genre: updatedGenre.name_genre,
            }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({ error: `Genre not found with ID: ${updatedGenre.id_genre}` });
        } else {
            res.status(200).json({ message: 'Genre updated successfully', updatedGenre });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du genre :', err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});


// DELETE GENRE by ID
/**
 * @openapi
 * /api/genres/{id}:
 *   delete:
 *     description: Delete a genre by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Genre to delete
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 */
app.delete('/api/genres/:id', async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(
            `
                DELETE FROM GENRE
                WHERE ID_GENRE = :id
            `,
            { id }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({ error: `Genre not found with ID: ${id}` });
        } else {
            res.status(200).json({ message: 'Genre deleted successfully' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du genre :', err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});
























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
