"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var swaggerJsdoc = require("swagger-jsdoc"); // * as swaggerJsdoc from 'swagger-jsdoc'
var swaggerUi = require("swagger-ui-express");
var database_1 = require("./database");
var jwt = require("jsonwebtoken");
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors());
/**
 * JWT secret (hard-coded for demo).
 * In production, use environment variables.
 */
var JWT_SECRET = 'mySecretKey';
/***********************************************************************
 * Async handler to wrap each route: avoids TS "No overload" issues
 ***********************************************************************/
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/** verifyToken: checks "Authorization: Bearer <token>", verifies, attaches user to req */
function verifyToken(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No token provided.' });
        return;
    }
    var token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token provided.' });
        return;
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
        return;
    }
}
/** isAdmin: checks if req.user.is_admin === true */
function isAdmin(req, res, next) {
    var user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Not authenticated.' });
        return;
    }
    if (!user.is_admin) {
        res.status(403).json({ error: 'Admin privileges required.' });
        return;
    }
    next();
}
var jsDocOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cinevision API',
            version: '1.0.0',
            description: 'API for managing movies in Cinevision',
        },
        components: {
            securitySchemes: {
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
                // Define other schemas for genres, production companies, etc.
                Genre: {
                    type: 'object',
                    properties: {
                        id_genre: { type: 'integer' },
                        name_genre: { type: 'string' },
                    },
                },
                ProductionCompany: {
                    type: 'object',
                    properties: {
                        id_company: { type: 'integer' },
                        name_company: { type: 'string' },
                    },
                },
                ProductionCountry: {
                    type: 'object',
                    properties: {
                        id_country: { type: 'string' },
                        name_country: { type: 'string' },
                    },
                },
                SpokenLanguage: {
                    type: 'object',
                    properties: {
                        id_spoken_languages: { type: 'string' },
                        language: { type: 'string' },
                    },
                },
                FilmGenre: {
                    type: 'object',
                    properties: {
                        film_id: { type: 'integer' },
                        genre_id: { type: 'integer' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        password: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        age: { type: 'integer', nullable: true },
                        is_admin: { type: 'boolean' },
                    },
                },
            },
        },
        security: [{ BearerAuth: [] }],
    },
    apis: ['server.js'],
};
var apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null, 2));
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));
app.get('/api/liveness', function (req, res) {
    res.send('OK !!!');
});
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
app.get('/api/films', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE, LINK_POSTER, LINK_TRAILER FROM FILM ORDER BY TITLE')];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error('Erreur lors de la récupération des films :', err_1);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/films/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT ID_FILM,\n                   TITLE,\n                   ORIGINAL_LANGUAGE,\n                   OVERVIEW,\n                   POPULARITY,\n                   RELEASE_DATE,\n                   RUNTIME,\n                   STATUS,\n                   VOTE_COUNT,\n                   VOTE_AVERAGE,\n                   LINK_POSTER,\n                   LINK_TRAILER\n            FROM FILM\n            WHERE ID_FILM = :id\n        ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.status(200).json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "Film not found with ID: ".concat(id) });
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error('Erreur lors de la récupération du film :', err_2);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.post('/api/films', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newFilm, insertResult, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newFilm = req.body;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                INSERT INTO FILM\n                (TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT,\n                 VOTE_AVERAGE, LINK_POSTER, LINK_TRAILER)\n                VALUES (:title, :original_language, :overview, :popularity, TO_DATE(:release_date, 'YYYY-MM-DD'),\n                        :runtime, :status, :vote_count, :vote_average, :link_poster, :link_trailer) RETURNING ID_FILM\n                INTO :id_film\n            ", {
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
                    })];
            case 1:
                insertResult = _a.sent();
                newFilm.id_film = insertResult.outBinds.id_film[0];
                res.status(201).json(newFilm);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error('Erreur lors de la création du film :', err_3.message);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.put('/api/films', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedFilm, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updatedFilm = req.body;
                if (!updatedFilm.id_film) {
                    res.status(400).json({ error: 'ID is required in the body to update a film.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                UPDATE FILM\n                SET TITLE             = :title,\n                    ORIGINAL_LANGUAGE = :original_language,\n                    OVERVIEW          = :overview,\n                    POPULARITY        = :popularity,\n                    RELEASE_DATE      = TO_DATE(:release_date, 'YYYY-MM-DD'),\n                    RUNTIME           = :runtime,\n                    STATUS            = :status,\n                    VOTE_COUNT        = :vote_count,\n                    VOTE_AVERAGE      = :vote_average,\n                    LINK_POSTER       = :link_poster,\n                    LINK_TRAILER      = :link_trailer\n                WHERE ID_FILM = :id_film\n            ", {
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
                    })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Film not found with ID: ".concat(updatedFilm.id_film) });
                }
                else {
                    res.status(200).json({ message: 'Film updated successfully', updatedFilm: updatedFilm });
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error('Erreur lors de la mise à jour du film :', err_4);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.delete('/api/films/:id', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                DELETE\n                FROM FILM\n                WHERE ID_FILM = :id\n            ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Film not found with ID: ".concat(id) });
                }
                else {
                    res.status(200).json({ message: 'Film deleted successfully' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error('Erreur lors de la suppression du film :', err_5);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/genres', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_GENRE, NAME_GENRE FROM GENRE')];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.error('Erreur lors de la récupération des genres :', err_6);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/genres/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT ID_GENRE, NAME_GENRE\n            FROM GENRE\n            WHERE ID_GENRE = :id\n        ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.status(200).json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "Genre not found with ID: ".concat(id) });
                }
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                console.error('Erreur lors de la récupération du genre :', err_7);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.post('/api/genres', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newGenre, insertResult, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newGenre = req.body;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                INSERT INTO GENRE\n                    (NAME_GENRE)\n                VALUES (:name_genre) RETURNING ID_GENRE\n                INTO :id_genre\n            ", {
                        name_genre: newGenre.name_genre,
                        id_genre: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
                    })];
            case 1:
                insertResult = _a.sent();
                newGenre.id_genre = insertResult.outBinds.id_genre[0];
                res.status(201).json(newGenre);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                console.error('Erreur lors de la création du genre :', err_8.message);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.put('/api/genres', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedGenre, result, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updatedGenre = req.body;
                if (!updatedGenre.id_genre) {
                    res.status(400).json({ error: 'ID is required in the body to update a genre.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                UPDATE GENRE\n                SET NAME_GENRE = :name_genre\n                WHERE ID_GENRE = :id_genre\n            ", {
                        id_genre: updatedGenre.id_genre,
                        name_genre: updatedGenre.name_genre,
                    })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Genre not found with ID: ".concat(updatedGenre.id_genre) });
                }
                else {
                    res.status(200).json({ message: 'Genre updated successfully', updatedGenre: updatedGenre });
                }
                return [3 /*break*/, 3];
            case 2:
                err_9 = _a.sent();
                console.error('Erreur lors de la mise à jour du genre :', err_9);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.delete('/api/genres/:id', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                DELETE\n                FROM GENRE\n                WHERE ID_GENRE = :id\n            ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Genre not found with ID: ".concat(id) });
                }
                else {
                    res.status(200).json({ message: 'Genre deleted successfully' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_10 = _a.sent();
                console.error('Erreur lors de la suppression du genre :', err_10);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/production-companies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_COMPANY, NAME_COMPANY FROM PRODUCTION_COMPANY')];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_11 = _a.sent();
                console.error('Erreur lors de la récupération des sociétés de production :', err_11);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/production-companies/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT ID_COMPANY, NAME_COMPANY\n            FROM PRODUCTION_COMPANY\n            WHERE ID_COMPANY = :id\n        ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.status(200).json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "Production company not found with ID: ".concat(id) });
                }
                return [3 /*break*/, 3];
            case 2:
                err_12 = _a.sent();
                console.error('Erreur lors de la récupération de la société de production :', err_12);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.post('/api/production-companies', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newCompany, insertResult, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newCompany = req.body;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                INSERT INTO PRODUCTION_COMPANY\n                    (NAME_COMPANY)\n                VALUES (:name_company) RETURNING ID_COMPANY\n                INTO :id_company\n            ", {
                        name_company: newCompany.name_company,
                        id_company: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
                    })];
            case 1:
                insertResult = _a.sent();
                newCompany.id_company = insertResult.outBinds.id_company[0];
                res.status(201).json(newCompany);
                return [3 /*break*/, 3];
            case 2:
                err_13 = _a.sent();
                console.error('Erreur lors de la création de la société de production :', err_13);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.put('/api/production-companies', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedCompany, result, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updatedCompany = req.body;
                if (!updatedCompany.id_company) {
                    res.status(400).json({ error: 'ID is required in the body to update a production company.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                UPDATE PRODUCTION_COMPANY\n                SET NAME_COMPANY = :name_company\n                WHERE ID_COMPANY = :id_company\n            ", {
                        id_company: updatedCompany.id_company,
                        name_company: updatedCompany.name_company,
                    })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Production company not found with ID: ".concat(updatedCompany.id_company) });
                }
                else {
                    res.status(200).json({ message: 'Production company updated successfully', updatedCompany: updatedCompany });
                }
                return [3 /*break*/, 3];
            case 2:
                err_14 = _a.sent();
                console.error('Erreur lors de la mise à jour de la société de production :', err_14);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.delete('/api/production-companies/:id', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                DELETE\n                FROM PRODUCTION_COMPANY\n                WHERE ID_COMPANY = :id\n            ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Production company not found with ID: ".concat(id) });
                }
                else {
                    res.status(200).json({ message: 'Production company deleted successfully' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_15 = _a.sent();
                console.error('Erreur lors de la suppression de la société de production :', err_15);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/production-countries', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_COUNTRY, NAME_COUNTRY FROM PRODUCTION_COUNTRY')];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_16 = _a.sent();
                console.error('Erreur lors de la récupération des pays de production :', err_16);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/production-countries/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT ID_COUNTRY, NAME_COUNTRY\n            FROM PRODUCTION_COUNTRY\n            WHERE ID_COUNTRY = :id\n        ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.status(200).json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "Country not found with ID: ".concat(id) });
                }
                return [3 /*break*/, 3];
            case 2:
                err_17 = _a.sent();
                console.error('Erreur lors de la récupération du pays de production :', err_17);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.put('/api/production-countries', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedCountry, result, err_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updatedCountry = req.body;
                if (!updatedCountry.id_country) {
                    res.status(400).json({ error: 'ID is required in the body to update a production country.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                UPDATE PRODUCTION_COUNTRY\n                SET NAME_COUNTRY = :name_country\n                WHERE ID_COUNTRY = :id_country\n            ", {
                        id_country: updatedCountry.id_country,
                        name_country: updatedCountry.name_country,
                    })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Production country not found with ID: ".concat(updatedCountry.id_country) });
                }
                else {
                    res.status(200).json({ message: 'Production country updated successfully', updatedCountry: updatedCountry });
                }
                return [3 /*break*/, 3];
            case 2:
                err_18 = _a.sent();
                console.error('Erreur lors de la mise à jour du pays de production :', err_18);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.delete('/api/production-countries/:id', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                DELETE\n                FROM PRODUCTION_COUNTRY\n                WHERE ID_COUNTRY = :id\n            ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Country not found with ID: ".concat(id) });
                }
                else {
                    res.status(200).json({ message: 'Country deleted successfully' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_19 = _a.sent();
                console.error('Erreur lors de la suppression du pays de production :', err_19);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/spoken_languages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_SPOKEN_LANGUAGES, LANGUAGE FROM SPOKEN_LANGUAGES')];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_20 = _a.sent();
                console.error('Erreur lors de la récupération des langues parlées :', err_20);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/spoken_languages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT ID_SPOKEN_LANGUAGES, LANGUAGE\n            FROM SPOKEN_LANGUAGES\n            WHERE ID_SPOKEN_LANGUAGES = :id\n        ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.status(200).json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: "Spoken language not found with ID: ".concat(id) });
                }
                return [3 /*break*/, 3];
            case 2:
                err_21 = _a.sent();
                console.error('Erreur lors de la récupération de la langue parlée :', err_21);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.put('/api/spoken_languages', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedLanguage, result, err_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updatedLanguage = req.body;
                if (!updatedLanguage.id_spoken_languages) {
                    res.status(400).json({ error: 'ID is required in the body to update a spoken language.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                UPDATE SPOKEN_LANGUAGES\n                SET LANGUAGE = :language\n                WHERE ID_SPOKEN_LANGUAGES = :id_spoken_languages\n            ", {
                        id_spoken_languages: updatedLanguage.id_spoken_languages,
                        language: updatedLanguage.language,
                    })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Spoken language not found with ID: ".concat(updatedLanguage.id_spoken_languages) });
                }
                else {
                    res.status(200).json({ message: 'Spoken language updated successfully', updatedLanguage: updatedLanguage });
                }
                return [3 /*break*/, 3];
            case 2:
                err_22 = _a.sent();
                console.error('Erreur lors de la mise à jour de la langue parlée :', err_22);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.delete('/api/spoken_languages/:id', verifyToken, isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, err_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                DELETE\n                FROM SPOKEN_LANGUAGES\n                WHERE ID_SPOKEN_LANGUAGES = :id\n            ", { id: id })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: "Spoken language not found with ID: ".concat(id) });
                }
                else {
                    res.status(200).json({ message: 'Spoken language deleted successfully' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_23 = _a.sent();
                console.error('Erreur lors de la suppression de la langue parlée :', err_23);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/film-genres', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT f.id_film,\n                   f.title,\n                   f.original_language,\n                   f.overview,\n                   f.popularity,\n                   f.release_date,\n                   f.runtime,\n                   f.status,\n                   f.vote_count,\n                   f.vote_average,\n                   f.link_poster,\n                   f.link_trailer,\n                   JSON_ARRAYAGG(JSON_OBJECT('name_genre' VALUE g.name_genre, 'id_genre' VALUE g.id_genre))\n                       AS genre\n            FROM film f\n                     JOIN film_genre fg ON f.id_film = fg.film_id\n                     JOIN genre g ON fg.genre_id = g.id_genre\n            GROUP BY f.id_film, f.title, f.original_language, f.overview, f.popularity,\n                     f.release_date, f.runtime, f.status, f.vote_count, f.vote_average,\n                     f.link_poster, f.link_trailer\n        ")];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_24 = _a.sent();
                console.error('Erreur lors de la récupération des genres des films :', err_24);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/films/genre/:name_genre', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_genre, result, err_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name_genre = req.params.name_genre;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT f.id_film,\n                   f.title,\n                   f.original_language,\n                   f.overview,\n                   f.popularity,\n                   f.release_date,\n                   f.runtime,\n                   f.status,\n                   f.vote_count,\n                   f.vote_average,\n                   f.link_poster,\n                   f.link_trailer,\n                   JSON_ARRAYAGG(\n                           JSON_OBJECT(\n                                   'name_genre' VALUE g.name_genre,\n                                   'id_genre' VALUE g.id_genre\n                               )\n                       ) AS genre\n            FROM film f\n                     JOIN film_genre fg ON f.id_film = fg.film_id\n                     JOIN genre g ON fg.genre_id = g.id_genre\n            WHERE g.name_genre = :name_genre\n            GROUP BY f.id_film,\n                     f.title,\n                     f.original_language,\n                     f.overview,\n                     f.popularity,\n                     f.release_date,\n                     f.runtime,\n                     f.status,\n                     f.vote_count,\n                     f.vote_average,\n                     f.link_poster,\n                     f.link_trailer\n        ", { name_genre: name_genre })];
            case 2:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 4];
            case 3:
                err_25 = _a.sent();
                console.error('Erreur lors de la récupération des films par genre :', err_25);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
app.get('/api/films/title/:title', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, result, err_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.params.title;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT f.id_film,\n                   f.title,\n                   f.original_language,\n                   f.overview,\n                   f.popularity,\n                   f.release_date,\n                   f.runtime,\n                   f.status,\n                   f.vote_count,\n                   f.vote_average,\n                   f.link_poster,\n                   f.link_trailer,\n                   JSON_ARRAYAGG(\n                           JSON_OBJECT(\n                                   'name_genre' VALUE g.name_genre,\n                                   'id_genre' VALUE g.id_genre\n                               )\n                       ) AS genre\n            FROM film f\n                     JOIN film_genre fg ON f.id_film = fg.film_id\n                     JOIN genre g ON fg.genre_id = g.id_genre\n            WHERE LOWER(f.title) LIKE LOWER(:title || '%')\n            GROUP BY f.id_film,\n                     f.title,\n                     f.original_language,\n                     f.overview,\n                     f.popularity,\n                     f.release_date,\n                     f.runtime,\n                     f.status,\n                     f.vote_count,\n                     f.vote_average,\n                     f.link_poster,\n                     f.link_trailer\n        ", { title: title })];
            case 2:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [3 /*break*/, 4];
            case 3:
                err_26 = _a.sent();
                console.error('Erreur lors de la récupération des films par titre :', err_26);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
app.post('/api/users/register', asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, first_name, last_name, age, is_admin, numericIsAdmin;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, first_name = _a.first_name, last_name = _a.last_name, age = _a.age, is_admin = _a.is_admin;
                numericIsAdmin = is_admin ? 1 : 0;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                INSERT INTO user_roles (email, password, first_name, last_name, age, is_admin)\n                VALUES (:email, :password, :first_name, :last_name, :age, :is_admin)\n            ", { email: email, password: password, first_name: first_name, last_name: last_name, age: age, is_admin: numericIsAdmin })];
            case 1:
                _b.sent();
                res.status(201).json({ message: 'User registered successfully' });
                return [2 /*return*/];
        }
    });
}); }));
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
app.post('/api/users/login', asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, result, row, user, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                SELECT email, password, first_name, last_name, age, is_admin\n                FROM user_roles\n                WHERE email = :email\n                  AND password = :password\n            ", { email: email, password: password })];
            case 1:
                result = _b.sent();
                if (!result.rows || result.rows.length === 0) {
                    res.status(401).json({ error: 'Invalid credentials' });
                    return [2 /*return*/];
                }
                row = result.rows[0];
                user = {
                    email: row[0],
                    password: row[1],
                    first_name: row[2],
                    last_name: row[3],
                    age: row[4],
                    is_admin: !!row[5],
                };
                token = jwt.sign({ email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: 'Login successful', token: token });
                return [2 /*return*/];
        }
    });
}); }));
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
app.get('/api/users', verifyToken, isAdmin, asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT email, password, first_name, last_name, age, is_admin\n            FROM user_roles\n        ")];
            case 1:
                result = _a.sent();
                res.status(200).json(result.rows);
                return [2 /*return*/];
        }
    });
}); }));
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
app.put('/api/users/:email/role', verifyToken, isAdmin, asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, is_admin, numericIsAdmin, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.email;
                is_admin = req.body.is_admin;
                numericIsAdmin = is_admin ? 1 : 0;
                return [4 /*yield*/, (0, database_1.executeQuery)("UPDATE user_roles\n             SET is_admin = :is_admin\n             WHERE email = :email", { email: email, is_admin: numericIsAdmin })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: 'User not found' });
                }
                else {
                    res.status(200).json({ message: 'User role updated successfully' });
                }
                return [2 /*return*/];
        }
    });
}); }));
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
app.delete('/api/users/:email', verifyToken, isAdmin, asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.email;
                return [4 /*yield*/, (0, database_1.executeQuery)("DELETE\n             FROM user_roles\n             WHERE email = :email", { email: email })];
            case 1:
                result = _a.sent();
                if (result.rowsAffected === 0) {
                    res.status(404).json({ error: 'User not found' });
                }
                else {
                    res.status(200).json({ message: 'User deleted successfully' });
                }
                return [2 /*return*/];
        }
    });
}); }));
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
app.get('/api/user_roles/:email', asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.email;
                if (!email) {
                    res.status(400).json({ error: 'Email requis.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                SELECT email\n                FROM user_roles\n                WHERE email = :email\n            ", { email: email })];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.status(409).json({ error: 'Utilisateur déjà existant.' });
                }
                else {
                    res.status(200).json({ message: 'Email disponible.' });
                }
                return [2 /*return*/];
        }
    });
}); }));
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
app.post('/api/films/:id/rate', asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, rating, film, currentVoteCount, currentVoteAverage, newVoteCount, newVoteAverage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = +req.params.id;
                rating = req.body.rating;
                if (!rating || rating < 1 || rating > 10) {
                    res.status(400).json({ error: 'Invalid rating. Must be between 1 and 10.' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, database_1.executeQuery)("SELECT vote_count, vote_average\n             FROM FILM\n             WHERE ID_FILM = :id", { id: id })];
            case 1:
                film = _a.sent();
                if (film.rows.length === 0) {
                    res.status(404).json({ error: "Film not found with ID: ".concat(id) });
                    return [2 /*return*/];
                }
                currentVoteCount = film.rows[0][0];
                currentVoteAverage = film.rows[0][1];
                newVoteCount = currentVoteCount + 1;
                newVoteAverage = (currentVoteAverage * currentVoteCount + rating) / newVoteCount;
                return [4 /*yield*/, (0, database_1.executeQuery)("\n                UPDATE FILM\n                SET VOTE_COUNT   = :vote_count,\n                    VOTE_AVERAGE = :vote_average\n                WHERE ID_FILM = :id\n            ", {
                        vote_count: newVoteCount,
                        vote_average: parseFloat(newVoteAverage.toFixed(1)),
                        id: id,
                    })];
            case 2:
                _a.sent();
                res.status(200).json({
                    message: 'Film rated successfully.',
                    updated: {
                        vote_count: newVoteCount,
                        vote_average: newVoteAverage.toFixed(1),
                    },
                });
                return [2 /*return*/];
        }
    });
}); }));
// Start the application
console.log('starting...');
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.initDB)()];
            case 1:
                _a.sent(); // Initialize the database connection
                app.listen(3000, function () {
                    console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
                });
                return [3 /*break*/, 3];
            case 2:
                err_27 = _a.sent();
                console.error('Failed to initialize database:', err_27);
                process.exit(1); // Exit if DB init fails
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
