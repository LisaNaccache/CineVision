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
                Todo: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                    },
                },
                TodoNoId: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                    },
                },

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

/*app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(apiDoc);
});*/

app.get('/api/liveness', (req: Request, res: Response) => {
    res.send('OK !!!');
});

interface Todo {
    id?: number;
    title: string;
    description?: string;
    priority?: number;
}

let idGenerator = 1;

function newId() {
    return idGenerator++;
}

let todos: Todo[] = [
    {id: newId(), title: 'Learn TypeScript'},
    {id: newId(), title: 'Learn Angular'},
    {id: newId(), title: 'Learn NodeJs'},
    {id: newId(), title: 'Learn Express'},
];


/**
 * @openapi
 * /api/todos:
 *   get:
 *     description: Get all todos
 *     responses:
 *       200:
 *         description: An array of Todo
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Todo'
 */
app.get('/api/todos', (req: Request, res: Response) => {
    console.log('handle http GET : /api/todos');
    res.send(todos);
});

/**
 * @openapi
 * /api/todos:
 *   post:
 *     description: save a new Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoNoId'
 *     responses:
 *       200:
 *         description: An array of Todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 */
app.post('/api/todos', (req: Request, res: Response) => {
    let item = <Todo>req.body;
    console.log('handle http POST /api/todos', item);
    item.id = newId();
    todos.push(item);
    res.send(item);
});

/**
 * @openapi
 * /api/todos:
 *   put:
 *     description: update an existing todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: An array of Todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 */
app.put('/api/todos', (req: Request, res: Response) => {
    let item = <Todo>req.body;
    console.log('handle http PUT /api/todos', item);
    const id = item.id;
    const idx = todos.findIndex((x) => x.id === id);
    if (idx !== -1) {
        const found = todos[idx];
        if (item.title) {
            found.title = item.title;
        }
        if (item.description) {
            found.description = item.description;
        }
        res.send(found);
    } else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});


/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     description: get a todo by its id
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the Todo to get
 *           schema:
 *             type: number
 *     responses:
 *       200:
 *         description: the todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
app.get('/api/todos/:id', (req, res) => {
    const id = +req.params['id']
    console.log('handle http GET /api/todos/:id', id);
    const idx = todos.findIndex((x) => x.id === id);
    if (idx !== -1) {
        const found = todos[idx];
        res.send(found);
    } else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     description: delete an existing Todo by its id
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the Todo to delete
 *           schema:
 *             type: number
 *     responses:
 *       200:
 *         description: the deleted Todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 *       404:
 *         description: when the Todo was not found
 */
app.delete('/api/todos/:id', (req, res) => {
    const id = +req.params['id']
    console.log('handle http DELETE /api/todos/:id', id);
    const idx = todos.findIndex((x) => x.id === id);
    if (idx !== -1) {
        const found = todos.splice(idx, 1)[0];
        res.send(found);
    } else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
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
        const result = await executeQuery('SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE FROM FILM');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des films :', err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
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
        const id = +req.params.id;

        const result = await executeQuery(`
            SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY,
                   RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE,
                   LINK_POSTER, LINK_TAILER
            FROM FILM
            WHERE ID_FILM = :id
        `, { id });

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: `Film not found with ID: ${id}` });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du film :', err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});




// POST FILM BY ID (crée ou met à jour)
/**
 * @openapi
 * /api/films/{id}:
 *   post:
 *     description: Add or update a film by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       201:
 *         description: The created or updated Film object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 */
app.post('/api/films/:id', async (req: Request, res: Response) => {
    try {
        const id = +req.params['id'];
        const film: Film = req.body;

        // On vérifie si le film existe
        const check = await executeQuery('SELECT ID_FILM FROM FILM WHERE ID_FILM = :id', { id });
        if (check.rows.length === 0) {
            // Insertion
            const insertResult = await executeQuery(
                `INSERT INTO FILM (ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE, LINK_POSTER, LINK_TAILER)
                 VALUES (:id, :title, :original_language, :overview, :popularity, :release_date, :runtime, :status, :vote_count, :vote_average, :link_poster, :link_tailer)`,
                {
                    id,
                    title: film.title,
                    original_language: film.original_language || null,
                    overview: film.overview || null,
                    popularity: film.popularity || null,
                    release_date: film.release_date || null,
                    runtime: film.runtime || null,
                    status: film.status || null,
                    vote_count: film.vote_count || null,
                    vote_average: film.vote_average || null,
                    link_poster: film.link_poster || null,
                    link_trailer: film.link_trailer || null
                }
            );
            film.id_film = id;
            res.status(201).json(film);
        } else {
            // Mise à jour
            await executeQuery(
                `UPDATE FILM SET 
                   TITLE = :title,
                   ORIGINAL_LANGUAGE = :original_language,
                   OVERVIEW = :overview,
                   POPULARITY = :popularity,
                   RELEASE_DATE = :release_date,
                   RUNTIME = :runtime,
                   STATUS = :status,
                   VOTE_COUNT = :vote_count,
                   VOTE_AVERAGE = :vote_average,
                   LINK_POSTER = :link_poster,
                   LINK_TAILER = :link_tailer
                 WHERE ID_FILM = :id`,
                {
                    id,
                    title: film.title,
                    original_language: film.original_language || null,
                    overview: film.overview || null,
                    popularity: film.popularity || null,
                    release_date: film.release_date || null,
                    runtime: film.runtime || null,
                    status: film.status || null,
                    vote_count: film.vote_count || null,
                    vote_average: film.vote_average || null,
                    link_poster: film.link_poster || null,
                    link_trailer: film.link_trailer || null
                }
            );
            film.id_film = id;
            res.status(200).json(film);
        }
    } catch (err) {
        console.error('Erreur lors de la création ou mise à jour du film :', err);
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