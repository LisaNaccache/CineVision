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
var database_1 = require("./database"); // import the helper from database.ts
var cors = require('cors');
var app = express();
app.use(express.json()); // => to parse request body with http header "content-type": "application/json"
app.use(cors());
var jsDocOptions = {
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
var apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null, 2));
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));
/*app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(apiDoc);
});*/
app.get('/api/liveness', function (req, res) {
    res.send('OK !!!');
});
var idGenerator = 1;
function newId() {
    return idGenerator++;
}
var todos = [
    { id: newId(), title: 'Learn TypeScript' },
    { id: newId(), title: 'Learn Angular' },
    { id: newId(), title: 'Learn NodeJs' },
    { id: newId(), title: 'Learn Express' },
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
app.get('/api/todos', function (req, res) {
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
app.post('/api/todos', function (req, res) {
    var item = req.body;
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
app.put('/api/todos', function (req, res) {
    var item = req.body;
    console.log('handle http PUT /api/todos', item);
    var id = item.id;
    var idx = todos.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = todos[idx];
        if (item.title) {
            found.title = item.title;
        }
        if (item.description) {
            found.description = item.description;
        }
        res.send(found);
    }
    else {
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
app.get('/api/todos/:id', function (req, res) {
    var id = +req.params['id'];
    console.log('handle http GET /api/todos/:id', id);
    var idx = todos.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = todos[idx];
        res.send(found);
    }
    else {
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
app.delete('/api/todos/:id', function (req, res) {
    var id = +req.params['id'];
    console.log('handle http DELETE /api/todos/:id', id);
    var idx = todos.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = todos.splice(idx, 1)[0];
        res.send(found);
    }
    else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});
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
app.get('/api/films', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE FROM FILM')];
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
                return [4 /*yield*/, (0, database_1.executeQuery)("\n            SELECT ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY,\n                   RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE,\n                   LINK_POSTER, LINK_TAILER\n            FROM FILM\n            WHERE ID_FILM = :id\n        ", { id: id })];
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
app.post('/api/films/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, film, check, insertResult, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                id = +req.params['id'];
                film = req.body;
                return [4 /*yield*/, (0, database_1.executeQuery)('SELECT ID_FILM FROM FILM WHERE ID_FILM = :id', { id: id })];
            case 1:
                check = _a.sent();
                if (!(check.rows.length === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, database_1.executeQuery)("INSERT INTO FILM (ID_FILM, TITLE, ORIGINAL_LANGUAGE, OVERVIEW, POPULARITY, RELEASE_DATE, RUNTIME, STATUS, VOTE_COUNT, VOTE_AVERAGE, LINK_POSTER, LINK_TAILER)\n                 VALUES (:id, :title, :original_language, :overview, :popularity, :release_date, :runtime, :status, :vote_count, :vote_average, :link_poster, :link_tailer)", {
                        id: id,
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
                    })];
            case 2:
                insertResult = _a.sent();
                film.id_film = id;
                res.status(201).json(film);
                return [3 /*break*/, 5];
            case 3: 
            // Mise à jour
            return [4 /*yield*/, (0, database_1.executeQuery)("UPDATE FILM SET \n                   TITLE = :title,\n                   ORIGINAL_LANGUAGE = :original_language,\n                   OVERVIEW = :overview,\n                   POPULARITY = :popularity,\n                   RELEASE_DATE = :release_date,\n                   RUNTIME = :runtime,\n                   STATUS = :status,\n                   VOTE_COUNT = :vote_count,\n                   VOTE_AVERAGE = :vote_average,\n                   LINK_POSTER = :link_poster,\n                   LINK_TAILER = :link_tailer\n                 WHERE ID_FILM = :id", {
                    id: id,
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
                })];
            case 4:
                // Mise à jour
                _a.sent();
                film.id_film = id;
                res.status(200).json(film);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                console.error('Erreur lors de la création ou mise à jour du film :', err_3);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// app.patch()
console.log('starting...');
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.initDB)()];
            case 1:
                _a.sent(); // Call initDB here
                app.listen(3000, function () {
                    console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error('Failed to initialize database:', err_4);
                process.exit(1); // Exit if DB init fails
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
/*
app.listen(3000, () => {
    console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
});

*/ 
