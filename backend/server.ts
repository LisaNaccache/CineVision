import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import swaggerJsdoc = require('swagger-jsdoc'); // * as swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi = require('swagger-ui-express');
import {executeQuery, initDB} from './database';
import * as jwt from 'jsonwebtoken';

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())

/**
 * JWT secret (hard-coded for demo).
 * In production, use environment variables.
 */
const JWT_SECRET = 'mySecretKey';

/***********************************************************************
 * Async handler to wrap each route: avoids TS "No overload" issues
 ***********************************************************************/
function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/***********************************************************************
 * JWT Middleware: verifyToken, isAdmin
 ***********************************************************************/
interface JwtPayload {
    email: string;
    is_admin: boolean;
    iat?: number;
    exp?: number;
}

/** verifyToken: checks "Authorization: Bearer <token>", verifies, attaches user to req */
function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({error: 'No token provided.'});
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({error: 'No token provided.'});
        return;
    }
    try {
        (req as any).user = jwt.verify(token, JWT_SECRET) as JwtPayload;
        next();
    } catch (err) {
        res.status(403).json({error: 'Invalid token.'});
        return;
    }
}

/** isAdmin: checks if req.user.is_admin === true */
function isAdmin(req: Request, res: Response, next: NextFunction): void {
    const user = (req as any).user;
    if (!user) {
        res.status(401).json({error: 'Not authenticated.'});
        return;
    }
    if (!user.is_admin) {
        res.status(403).json({error: 'Admin privileges required.'});
        return;
    }
    next();
}

const jsDocOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cinevision API',
            version: '1.0.0',
            description: 'API for managing movies in Cinevision',
        },
        components: {
            securitySchemes: { //we add a Bearer Token authentication
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Define the Film schema
                Film: {
                    type: 'object',
                    properties: {
                        id_film: {type: 'integer'},
                        title: {type: 'string'},
                        original_language: {type: 'string'},
                        overview: {type: 'string'},
                        popularity: {type: 'number'},
                        release_date: {type: 'string', format: 'date'},
                        runtime: {type: 'number'},
                        status: {type: 'string'},
                        vote_count: {type: 'integer'},
                        vote_average: {type: 'number'},
                        link_poster: {type: 'string'},
                        link_trailer: {type: 'string'},
                    },
                },
                // Define other schemas for genres, production companies, etc.
                Genre: {
                    type: 'object',
                    properties: {
                        id_genre: {type: 'integer'},
                        name_genre: {type: 'string'},
                    },
                },

                ProductionCompany: {
                    type: 'object',
                    properties: {
                        id_company: {type: 'integer'},
                        name_company: {type: 'string'},
                    },
                },

                ProductionCountry: {
                    type: 'object',
                    properties: {
                        id_country: {type: 'string'},
                        name_country: {type: 'string'},
                    },
                },

                SpokenLanguage: {
                    type: 'object',
                    properties: {
                        id_spoken_languages: {type: 'string'},
                        language: {type: 'string'},
                    },
                },

                FilmGenre: {
                    type: 'object',
                    properties: {
                        film_id: {type: 'integer'},
                        genre_id: {type: 'integer'},
                    },
                },

                User: {
                    type: 'object',
                    properties: {
                        email: {type: 'string'},
                        password: {type: 'string'},
                        first_name: {type: 'string'},
                        last_name: {type: 'string'},
                        age: {type: 'integer', nullable: true},
                        is_admin: {type: 'boolean'},
                    },
                },
            },
        },
        security: [{BearerAuth: []}],
    },
    apis: ['server.js'],
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


/**
 * @openapi
 * /api/films:
 *   post:
 *     description: Add a new film (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       201:
 *         description: The created Film object
 *       401:
 *         description: Unauthorized, token required
 *       403:
 *         description: Forbidden, admin access required
 */
app.post('/api/films', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const newFilm: Film = req.body;

        const insertResult = await executeQuery(
            `
                INSERT INTO FILM
                (TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT,
                 VOTE_AVERAGE, LINK_POSTER, LINK_TRAILER)
                VALUES (:title, :original_language, :overview, :popularity, TO_DATE(:release_date, 'YYYY-MM-DD'),
                        :runtime, :status, :vote_count, :vote_average, :link_poster, :link_trailer) RETURNING ID_FILM
                INTO :id_film
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
                id_film: {dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER},
            }
        ) as { outBinds: { id_film: number[] } };

        newFilm.id_film = insertResult.outBinds.id_film[0];

        res.status(201).json(newFilm);
    } catch (err) {
        console.error('Erreur lors de la création du film :', err.message);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


/**
 * @openapi
 * /api/films:
 *   put:
 *     description: Update a film (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       200:
 *         description: Film updated successfully
 *       400:
 *         description: ID not provided
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Film not found
 */
app.put('/api/films', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const updatedFilm: Film = req.body;

        if (!updatedFilm.id_film) {
            res.status(400).json({error: 'ID is required in the body to update a film.'});
            return;
        }

        const result = await executeQuery(
            `
                UPDATE FILM
                SET TITLE             = :title,
                    ORIGINAL_LANGUAGE = :original_language,
                    OVERVIEW          = :overview,
                    POPULARITY        = :popularity,
                    RELEASE_DATE      = TO_DATE(:release_date, 'YYYY-MM-DD'),
                    RUNTIME           = :runtime,
                    STATUS            = :status,
                    VOTE_COUNT        = :vote_count,
                    VOTE_AVERAGE      = :vote_average,
                    LINK_POSTER       = :link_poster,
                    LINK_TRAILER      = :link_trailer
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
            res.status(404).json({error: `Film not found with ID: ${updatedFilm.id_film}`});
        } else {
            res.status(200).json({message: 'Film updated successfully', updatedFilm});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du film :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/films/{id}:
 *   delete:
 *     description: Delete a film by ID (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the film
 *     responses:
 *       200:
 *         description: Film deleted successfully
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Film not found
 */
app.delete('/api/films/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(
            `
                DELETE
                FROM FILM
                WHERE ID_FILM = :id
            `,
            {id}
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Film not found with ID: ${id}`});
        } else {
            res.status(200).json({message: 'Film deleted successfully'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du film :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//                  GENRE
// ---------------------------------------

interface Genre {
    id_genre?: number;
    name_genre: string;
}

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

/**
 * @openapi
 * /api/genres:
 *   post:
 *     description: Add a new genre (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       201:
 *         description: Genre created successfully
 *       403:
 *         description: Forbidden, admin access required
 */
app.post('/api/genres', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const newGenre: Genre = req.body;

        const insertResult = await executeQuery(
            `
                INSERT INTO GENRE
                    (NAME_GENRE)
                VALUES (:name_genre) RETURNING ID_GENRE
                INTO :id_genre
            `,
            {
                name_genre: newGenre.name_genre,
                id_genre: {dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER},
            }
        ) as { outBinds: { id_genre: number[] } };

        newGenre.id_genre = insertResult.outBinds.id_genre[0];

        res.status(201).json(newGenre);
    } catch (err) {
        console.error('Erreur lors de la création du genre :', err.message);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/genres:
 *   put:
 *     description: Update a genre (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       400:
 *         description: ID not provided
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Genre not found
 */
app.put('/api/genres', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const updatedGenre: Genre = req.body;

        if (!updatedGenre.id_genre) {
            res.status(400).json({error: 'ID is required in the body to update a genre.'});
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
            res.status(404).json({error: `Genre not found with ID: ${updatedGenre.id_genre}`});
        } else {
            res.status(200).json({message: 'Genre updated successfully', updatedGenre});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du genre :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/genres/{id}:
 *   delete:
 *     description: Delete a genre by ID (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the genre
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Genre not found
 */
app.delete('/api/genres/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(
            `
                DELETE
                FROM GENRE
                WHERE ID_GENRE = :id
            `,
            {id}
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Genre not found with ID: ${id}`});
        } else {
            res.status(200).json({message: 'Genre deleted successfully'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du genre :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//            production_company
// ---------------------------------------

interface ProductionCompany {
    id_company?: number;
    name_company: string;
}

/**
 * @openapi
 * /api/production-companies:
 *   get:
 *     description: Get all production companies
 *     responses:
 *       200:
 *         description: An array of ProductionCompany
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductionCompany'
 */
app.get('/api/production-companies', async (req: Request, res: Response) => {
    try {
        const result = await executeQuery('SELECT ID_COMPANY, NAME_COMPANY FROM PRODUCTION_COMPANY');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des sociétés de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/production-companies/{id}:
 *   get:
 *     description: Get a production company by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the production company to get
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: The requested ProductionCompany object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductionCompany'
 *       404:
 *         description: Production company not found
 */
app.get('/api/production-companies/:id', async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(`
            SELECT ID_COMPANY, NAME_COMPANY
            FROM PRODUCTION_COMPANY
            WHERE ID_COMPANY = :id
        `, {id});

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({error: `Production company not found with ID: ${id}`});
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la société de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/production-companies:
 *   post:
 *     description: Add a new production company (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductionCompany'
 *     responses:
 *       201:
 *         description: Production company created successfully
 *       403:
 *         description: Forbidden, admin access required
 */
app.post('/api/production-companies', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const newCompany: ProductionCompany = req.body;

        const insertResult = await executeQuery(
            `
                INSERT INTO PRODUCTION_COMPANY
                    (NAME_COMPANY)
                VALUES (:name_company) RETURNING ID_COMPANY
                INTO :id_company
            `,
            {
                name_company: newCompany.name_company,
                id_company: {dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER},
            }
        ) as { outBinds: { id_company: number[] } };

        newCompany.id_company = insertResult.outBinds.id_company[0];

        res.status(201).json(newCompany);
    } catch (err) {
        console.error('Erreur lors de la création de la société de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/production-companies:
 *   put:
 *     description: Update a production company (admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductionCompany'
 *     responses:
 *       200:
 *         description: Production company updated successfully
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Production company not found
 */
app.put('/api/production-companies', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const updatedCompany: ProductionCompany = req.body;

        if (!updatedCompany.id_company) {
            res.status(400).json({error: 'ID is required in the body to update a production company.'});
            return;
        }

        const result = await executeQuery(
            `
                UPDATE PRODUCTION_COMPANY
                SET NAME_COMPANY = :name_company
                WHERE ID_COMPANY = :id_company
            `,
            {
                id_company: updatedCompany.id_company,
                name_company: updatedCompany.name_company,
            }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Production company not found with ID: ${updatedCompany.id_company}`});
        } else {
            res.status(200).json({message: 'Production company updated successfully', updatedCompany});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la société de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/production-companies/{id}:
 *   delete:
 *     security:
 *       - BearerAuth: [] # Requires Bearer Token
 *     description: Delete a production company by its ID (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the production company to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Production company deleted successfully
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Production company not found
 */
app.delete('/api/production-companies/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const result = await executeQuery(
            `
                DELETE
                FROM PRODUCTION_COMPANY
                WHERE ID_COMPANY = :id
            `,
            {id}
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Production company not found with ID: ${id}`});
        } else {
            res.status(200).json({message: 'Production company deleted successfully'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de la société de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//            production_country
// ---------------------------------------

interface ProductionCountry {
    id_country: string;
    name_country: string;
}

/**
 * @openapi
 * /api/production-countries:
 *   get:
 *     description: Get all production countries
 *     responses:
 *       200:
 *         description: An array of ProductionCountry
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductionCountry'
 */
app.get('/api/production-countries', async (req: Request, res: Response) => {
    try {
        const result = await executeQuery('SELECT ID_COUNTRY, NAME_COUNTRY FROM PRODUCTION_COUNTRY');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des pays de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


/**
 * @openapi
 * /api/production-countries/{id}:
 *   get:
 *     description: Get a production country by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Production Country to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested ProductionCountry object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductionCountry'
 *       404:
 *         description: Production Country not found
 */
app.get('/api/production-countries/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await executeQuery(`
            SELECT ID_COUNTRY, NAME_COUNTRY
            FROM PRODUCTION_COUNTRY
            WHERE ID_COUNTRY = :id
        `, {id});

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({error: `Country not found with ID: ${id}`});
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du pays de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


/**
 * @openapi
 * /api/production-countries:
 *   put:
 *     description: Update an existing production country (Admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductionCountry'
 *     responses:
 *       200:
 *         description: Production country updated successfully
 *       400:
 *         description: Bad request - ID is required in the body
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Production country not found
 */
app.put('/api/production-countries', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const updatedCountry: ProductionCountry = req.body;

        if (!updatedCountry.id_country) {
            res.status(400).json({error: 'ID is required in the body to update a production country.'});
            return;
        }

        const result = await executeQuery(
            `
                UPDATE PRODUCTION_COUNTRY
                SET NAME_COUNTRY = :name_country
                WHERE ID_COUNTRY = :id_country
            `,
            {
                id_country: updatedCountry.id_country,
                name_country: updatedCountry.name_country,
            }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Production country not found with ID: ${updatedCountry.id_country}`});
        } else {
            res.status(200).json({message: 'Production country updated successfully', updatedCountry});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du pays de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/production-countries/{id}:
 *   delete:
 *     description: Delete a production country by its ID (Admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the production country
 *     responses:
 *       200:
 *         description: Production country deleted successfully
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Production country not found
 */
app.delete('/api/production-countries/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await executeQuery(
            `
                DELETE
                FROM PRODUCTION_COUNTRY
                WHERE ID_COUNTRY = :id
            `,
            {id}
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Country not found with ID: ${id}`});
        } else {
            res.status(200).json({message: 'Country deleted successfully'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du pays de production :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//           spoken_languages
// ---------------------------------------

interface SpokenLanguage {
    id_spoken_languages: string;
    language: string;
}

/**
 * @openapi
 * /api/spoken_languages:
 *   get:
 *     description: Get all spoken languages
 *     responses:
 *       200:
 *         description: An array of SpokenLanguage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SpokenLanguage'
 */
app.get('/api/spoken_languages', async (req: Request, res: Response) => {
    try {
        const result = await executeQuery('SELECT ID_SPOKEN_LANGUAGES, LANGUAGE FROM SPOKEN_LANGUAGES');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des langues parlées :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/spoken_languages/{id}:
 *   get:
 *     description: Get a spoken language by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the SpokenLanguage to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested SpokenLanguage object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpokenLanguage'
 *       404:
 *         description: SpokenLanguage not found
 */
app.get('/api/spoken_languages/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await executeQuery(`
            SELECT ID_SPOKEN_LANGUAGES, LANGUAGE
            FROM SPOKEN_LANGUAGES
            WHERE ID_SPOKEN_LANGUAGES = :id
        `, {id});

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({error: `Spoken language not found with ID: ${id}`});
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la langue parlée :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


/**
 * @openapi
 * /api/spoken_languages:
 *   put:
 *     description: Update an existing spoken language (Admin only)
 *     security:
 *       - BearerAuth: [] # Requires admin authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpokenLanguage'
 *     responses:
 *       200:
 *         description: Spoken language updated successfully
 *       400:
 *         description: ID is required in the body
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Spoken language not found
 */
app.put('/api/spoken_languages', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const updatedLanguage: SpokenLanguage = req.body;

        if (!updatedLanguage.id_spoken_languages) {
            res.status(400).json({error: 'ID is required in the body to update a spoken language.'});
            return;
        }

        const result = await executeQuery(
            `
                UPDATE SPOKEN_LANGUAGES
                SET LANGUAGE = :language
                WHERE ID_SPOKEN_LANGUAGES = :id_spoken_languages
            `,
            {
                id_spoken_languages: updatedLanguage.id_spoken_languages,
                language: updatedLanguage.language,
            }
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Spoken language not found with ID: ${updatedLanguage.id_spoken_languages}`});
        } else {
            res.status(200).json({message: 'Spoken language updated successfully', updatedLanguage});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la langue parlée :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});

/**
 * @openapi
 * /api/spoken_languages/{id}:
 *   delete:
 *     description: Delete a spoken language by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the spoken language to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Spoken language deleted successfully
 *       404:
 *         description: Spoken language not found
 *       500:
 *         description: Internal server error
 */
app.delete('/api/spoken_languages/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await executeQuery(
            `
                DELETE
                FROM SPOKEN_LANGUAGES
                WHERE ID_SPOKEN_LANGUAGES = :id
            `,
            {id}
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({error: `Spoken language not found with ID: ${id}`});
        } else {
            res.status(200).json({message: 'Spoken language deleted successfully'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de la langue parlée :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//               film_genre
// ---------------------------------------

interface FilmGenre {
    film_id: number;
    genre_id: number;
}

/**
 * @openapi
 * /api/film-genres:
 *   get:
 *     description: Get all film-genre relationships
 *     responses:
 *       200:
 *         description: An array of FilmGenre relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FilmGenre'
 */
app.get('/api/film-genres', async (req: Request, res: Response) => {
    try {
        const result = await executeQuery(`
            SELECT f.id_film,
                   f.title,
                   f.original_language,
                   f.overview,
                   f.popularity,
                   f.release_date,
                   f.runtime,
                   f.status,
                   f.vote_count,
                   f.vote_average,
                   f.link_poster,
                   f.link_trailer,
                   JSON_ARRAYAGG(JSON_OBJECT('name_genre' VALUE g.name_genre, 'id_genre' VALUE g.id_genre))
                       AS genre
            FROM film f
                     JOIN film_genre fg ON f.id_film = fg.film_id
                     JOIN genre g ON fg.genre_id = g.id_genre
            GROUP BY f.id_film, f.title, f.original_language, f.overview, f.popularity,
                     f.release_date, f.runtime, f.status, f.vote_count, f.vote_average,
                     f.link_poster, f.link_trailer
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des genres des films :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//            GET Films by Genre
// ---------------------------------------

/**
 * @openapi
 * /api/films/genre/{name_genre}:
 *   get:
 *     description: Get all films associated with a specific genre
 *     parameters:
 *       - name: name_genre
 *         in: path
 *         required: true
 *         description: The name of the genre to filter films by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of films with their associated genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_film:
 *                     type: number
 *                   title:
 *                     type: string
 *                   original_language:
 *                     type: string
 *                   overview:
 *                     type: string
 *                   popularity:
 *                     type: number
 *                   release_date:
 *                     type: string
 *                     format: date
 *                   runtime:
 *                     type: number
 *                   status:
 *                     type: string
 *                   vote_count:
 *                     type: number
 *                   vote_average:
 *                     type: number
 *                   link_poster:
 *                     type: string
 *                   link_trailer:
 *                     type: string
 *                   genre:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name_genre:
 *                           type: string
 *                         id_genre:
 *                           type: number
 */
app.get('/api/films/genre/:name_genre', async (req: Request, res: Response) => {
    const {name_genre} = req.params;

    try {
        const result = await executeQuery(`
            SELECT f.id_film,
                   f.title,
                   f.original_language,
                   f.overview,
                   f.popularity,
                   f.release_date,
                   f.runtime,
                   f.status,
                   f.vote_count,
                   f.vote_average,
                   f.link_poster,
                   f.link_trailer,
                   JSON_ARRAYAGG(
                           JSON_OBJECT(
                                   'name_genre' VALUE g.name_genre,
                                   'id_genre' VALUE g.id_genre
                               )
                       ) AS genre
            FROM film f
                     JOIN film_genre fg ON f.id_film = fg.film_id
                     JOIN genre g ON fg.genre_id = g.id_genre
            WHERE g.name_genre = :name_genre
            GROUP BY f.id_film,
                     f.title,
                     f.original_language,
                     f.overview,
                     f.popularity,
                     f.release_date,
                     f.runtime,
                     f.status,
                     f.vote_count,
                     f.vote_average,
                     f.link_poster,
                     f.link_trailer
        `, {name_genre});

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des films par genre :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


// ---------------------------------------
//            GET Films by Title
// ---------------------------------------

/**
 * @openapi
 * /api/films/title/{title}:
 *   get:
 *     description: Get all films whose title matches the search string
 *     parameters:
 *       - name: title
 *         in: path
 *         required: true
 *         description: Partial or full title of the film to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of films with their associated genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_film:
 *                     type: number
 *                   title:
 *                     type: string
 *                   original_language:
 *                     type: string
 *                   overview:
 *                     type: string
 *                   popularity:
 *                     type: number
 *                   release_date:
 *                     type: string
 *                     format: date
 *                   runtime:
 *                     type: number
 *                   status:
 *                     type: string
 *                   vote_count:
 *                     type: number
 *                   vote_average:
 *                     type: number
 *                   link_poster:
 *                     type: string
 *                   link_trailer:
 *                     type: string
 *                   genre:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name_genre:
 *                           type: string
 *                         id_genre:
 *                           type: number
 */
app.get('/api/films/title/:title', async (req: Request, res: Response) => {
    const {title} = req.params;

    try {
        const result = await executeQuery(`
            SELECT f.id_film,
                   f.title,
                   f.original_language,
                   f.overview,
                   f.popularity,
                   f.release_date,
                   f.runtime,
                   f.status,
                   f.vote_count,
                   f.vote_average,
                   f.link_poster,
                   f.link_trailer,
                   JSON_ARRAYAGG(
                           JSON_OBJECT(
                                   'name_genre' VALUE g.name_genre,
                                   'id_genre' VALUE g.id_genre
                               )
                       ) AS genre
            FROM film f
                     JOIN film_genre fg ON f.id_film = fg.film_id
                     JOIN genre g ON fg.genre_id = g.id_genre
            WHERE LOWER(f.title) LIKE LOWER(:title || '%')
            GROUP BY f.id_film,
                     f.title,
                     f.original_language,
                     f.overview,
                     f.popularity,
                     f.release_date,
                     f.runtime,
                     f.status,
                     f.vote_count,
                     f.vote_average,
                     f.link_poster,
                     f.link_trailer
        `, {title});

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des films par titre :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});
    }
});


/***********************************************************************
 * USER (EMAIL as PK)
 ***********************************************************************/
interface User {
    email: string;      // primary key
    password: string;
    first_name: string;
    last_name: string;
    age?: number;
    is_admin: boolean;
}

/**
 * REGISTER user
 * @openapi
 * /api/users/register:
 *   post:
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
app.post(
    '/api/users/register',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {email, password, first_name, last_name, age, is_admin} = req.body;
        const numericIsAdmin = is_admin ? 1 : 0;
        await executeQuery(
            `
                INSERT INTO user_roles (email, password, first_name, last_name, age, is_admin)
                VALUES (:email, :password, :first_name, :last_name, :age, :is_admin)
            `,
            {email, password, first_name, last_name, age, is_admin: numericIsAdmin}
        );
        res.status(201).json({message: 'User registered successfully'});
        return;
    })
);

/**
 * LOGIN user
 * @openapi
 * /api/users/login:
 *   post:
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
app.post(
    '/api/users/login',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {email, password} = req.body;
        const result = await executeQuery(
            `
                SELECT email, password, first_name, last_name, age, is_admin
                FROM user_roles
                WHERE email = :email
                  AND password = :password
            `,
            {email, password}
        );
        if (!result.rows || result.rows.length === 0) {
            res.status(401).json({error: 'Invalid credentials'});
            return;
        }

        const row = result.rows[0];
        const user = {
            email: row[0],
            password: row[1],
            first_name: row[2],
            last_name: row[3],
            age: row[4],
            is_admin: !!row[5],
        };

        // Generate JWT
        const token = jwt.sign(
            {email: user.email, is_admin: user.is_admin},
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({message: 'Login successful', token});
        return;
    })
);

/**
 * @openapi
 * /api/users:
 *   get:
 *     security:
 *       - BearerAuth: [] # Explicitly add security here
 *     description: Get all users (admin only)
 *     responses:
 *       200:
 *         description: An array of User
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token required
 *       403:
 *         description: Forbidden, admin access required
 */


app.get(
    '/api/users',
    verifyToken,
    isAdmin,
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const result = await executeQuery(`
            SELECT email, password, first_name, last_name, age, is_admin
            FROM user_roles
        `);
        res.status(200).json(result.rows);
        return;
    })
);

/**
 * Update role
 * @openapi
 * /api/users/{email}/role:
 *   put:
 *     description: Update the role of a user (admin only)
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: user email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User role updated
 *       404:
 *         description: Not found
 */
app.put(
    '/api/users/:email/role',
    verifyToken,
    isAdmin,
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {email} = req.params;
        const {is_admin} = req.body;
        const numericIsAdmin = is_admin ? 1 : 0;
        const result = await executeQuery(
            `UPDATE user_roles
             SET is_admin = :is_admin
             WHERE email = :email`,
            {email, is_admin: numericIsAdmin}
        );
        if (result.rowsAffected === 0) {
            res.status(404).json({error: 'User not found'});
        } else {
            res.status(200).json({message: 'User role updated successfully'});
        }
        return;
    })
);

/**
 * DELETE user
 * @openapi
 * /api/users/{email}:
 *   delete:
 *     description: Delete a user by email (admin only)
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: Not found
 */
app.delete(
    '/api/users/:email',
    verifyToken,
    isAdmin,
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {email} = req.params;
        const result = await executeQuery(
            `DELETE
             FROM user_roles
             WHERE email = :email`,
            {email}
        );
        if (result.rowsAffected === 0) {
            res.status(404).json({error: 'User not found'});
        } else {
            res.status(200).json({message: 'User deleted successfully'});
        }
        return;
    })
);

/**
 * @openapi
 * /api/user_roles/{email}:
 *   get:
 *     description: Vérifie si un utilisateur existe dans la table user_roles par email.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur à vérifier
 *     responses:
 *       400:
 *         description: Email requis
 *       404:
 *         description: Aucun utilisateur trouvé avec cet email
 *       200:
 *         description: L'utilisateur existe
 */
app.get(
    '/api/user_roles/:email',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {email} = req.params;

        if (!email) {
            res.status(400).json({error: 'Email requis.'});
            return;
        }

        const result = await executeQuery(
            `
                SELECT email
                FROM user_roles
                WHERE email = :email
            `,
            {email}
        );

        if (result.rows.length > 0) {
            res.status(409).json({error: 'Utilisateur déjà existant.'});
        } else {
            res.status(200).json({message: 'Email disponible.'});
        }
    })
);

/**
 * @openapi
 * /api/films/{id}/rate:
 *   post:
 *     description: Rate a film (1-10), updates vote count and average.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film to rate
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             rating: 8
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *     responses:
 *       200:
 *         description: Film rating updated successfully.
 *       400:
 *         description: Bad request (e.g., invalid rating or missing fields).
 *       404:
 *         description: Film not found.
 *       500:
 *         description: Internal server error.
 */
app.post(
    '/api/films/:id/rate',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        const {rating} = req.body;

        if (!rating || rating < 1 || rating > 10) {
            res.status(400).json({error: 'Invalid rating. Must be between 1 and 10.'});
            return;
        }

        const film = await executeQuery(
            `SELECT vote_count, vote_average
             FROM FILM
             WHERE ID_FILM = :id`,
            {id}
        );

        if (film.rows.length === 0) {
            res.status(404).json({error: `Film not found with ID: ${id}`});
            return;
        }

        const currentVoteCount = film.rows[0][0];
        const currentVoteAverage = film.rows[0][1];

        const newVoteCount = currentVoteCount + 1;
        const newVoteAverage =
            (currentVoteAverage * currentVoteCount + rating) / newVoteCount;

        await executeQuery(
            `
                UPDATE FILM
                SET VOTE_COUNT   = :vote_count,
                    VOTE_AVERAGE = :vote_average
                WHERE ID_FILM = :id
            `,
            {
                vote_count: newVoteCount,
                vote_average: parseFloat(newVoteAverage.toFixed(1)),
                id,
            }
        );

        res.status(200).json({
            message: 'Film rated successfully.',
            updated: {
                vote_count: newVoteCount,
                vote_average: newVoteAverage.toFixed(1),
            },
        });
    })
);


// Start the application
console.log('starting...');
(async () => {
    try {
        await initDB(); // Initialize the database connection
        app.listen(3000, () => {
            console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
        });
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1); // Exit if DB init fails
    }
})();