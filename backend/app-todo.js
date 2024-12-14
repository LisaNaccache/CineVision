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
var LearningPackage_1 = require("./models/LearningPackage");
var cors = require('cors');
var app = express();
app.use(express.json()); // => to parse request body with http header "content-type": "application/json"
app.use(cors());
var jsDocOptions = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'Documentation for Express API with Swagger',
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
                // Define other schemas as needed
                LearningPackage: {
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
                        category: {
                            type: 'string',
                        },
                        targetAudience: {
                            type: 'string',
                        },
                        difficulty: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 20
                        },
                    },
                },
                LearningPackageNoId: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        category: {
                            type: 'string',
                        },
                        targetAudience: {
                            type: 'string',
                        },
                        difficulty: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 20
                        },
                    },
                },
                UserPackageLearning: {
                    type: 'object',
                    properties: {
                        startDate: {
                            type: 'string',
                            format: 'date'
                        },
                        expectedEndDate: {
                            type: 'string',
                            format: 'date'
                        },
                        minutesPerDayObjective: {
                            type: 'integer',
                        },
                    },
                },
                UserLearningFact: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        reviewCount: {
                            type: 'integer',
                        },
                        confidenceLevel: {
                            type: 'integer',
                        },
                        lastReviewedDate: {
                            type: 'string',
                            format: 'date'
                        },
                    },
                },
                UserLearningFactNoId: {
                    type: 'object',
                    properties: {
                        reviewCount: {
                            type: 'integer',
                        },
                        confidenceLevel: {
                            type: 'integer',
                        },
                        lastReviewedDate: {
                            type: 'string',
                            format: 'date'
                        },
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
var learningPackages = [
    {
        id: 1,
        title: "Learn TypeScript",
        description: "An introduction to TypeScript language and its core concepts.",
        category: "Programming",
        targetAudience: "Developers",
        difficulty: 5
    },
    {
        id: 2,
        title: "Learn NodeJs",
        description: "Learn the basics of Node.js and how to create a server.",
        category: "Backend Development",
        targetAudience: "Web Developers",
        difficulty: 6
    },
    {
        id: 3,
        title: "Learn Html",
        description: "Learn the fundamentals of HTML for web development.",
        category: "Frontend Development",
        targetAudience: "Beginners",
        difficulty: 3
    },
    {
        id: 4,
        title: "Learn Angular",
        description: "An introduction to Angular framework for building dynamic web applications.",
        category: "Frontend Frameworks",
        targetAudience: "Frontend Developers",
        difficulty: 7
    }
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
    console.log('handle http GET /api/todos');
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
// Endpoint LearningPackage
/**
 * @openapi
 * /api/package:
 *   get:
 *     description: Get all learning packages
 *     responses:
 *       200:
 *         description: An array of LearningPackage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningPackage'
 */
app.get('/api/package', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var packages, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, LearningPackage_1.default.findAll()];
            case 1:
                packages = _a.sent();
                res.status(200).json(packages);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error('Erreur lors de la récupération des packages :', err_1);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/*app.get('/api/package', (req, res) => {
    res.status(200).json(learningPackages);
});*/
/**
 * @openapi
 * /api/package/{id}:
 *   get:
 *     description: Get a learning package by its id
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the Learning Package to get
 *           schema:
 *             type: number
 *     responses:
 *       200:
 *         description: the learning package
 *         schema:
 *           $ref: '#/components/schemas/LearningPackage'
 *       404:
 *         description: Learning Package not found
 */
app.get('/api/package/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, foundPackage, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +req.params.id;
                return [4 /*yield*/, LearningPackage_1.default.findByPk(id)];
            case 1:
                foundPackage = _a.sent();
                if (foundPackage) {
                    res.status(200).json(foundPackage);
                }
                else {
                    res.status(404).json({ error: "Package non trouv\u00E9 avec l'ID : ".concat(id) });
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error('Erreur lors de la récupération du package :', err_2);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/*app.get('/api/package/:id', (req, res) => {
    const id = +req.params['id']
    console.log('handle http GET /api/package/:id', id);
    const idx = learningPackages.findIndex((x) => x.id === id);
    if (idx !== -1) {
        const found = learningPackages[idx];
        res.send(found);
    } else {
        res.status(404).send('Learning Package entity not found by id:' + id);
    }
});*/
/**
 * @openapi
 * /api/package:
 *   post:
 *     description: save a new Learning Package
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LearningPackageNoId'
 *     responses:
 *       200:
 *         description: An array of LearningPackages
 *         schema:
 *           $ref: '#/components/schemas/LearningPackage'
 */
app.post('/api/package', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newPackage, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, LearningPackage_1.default.create(req.body)];
            case 1:
                newPackage = _a.sent();
                res.status(201).json(newPackage);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error('Erreur lors de la création du package :', err_3);
                res.status(400).json({ error: 'Erreur lors de la validation ou de la création.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/*app.post('/api/package', (req: Request, res: Response) => {
    let item = <LearningPackage>req.body;
    console.log('handle http POST /api/package', item);
    item.id = newId();
    learningPackages.push(item);
    res.send(item);
});*/
/**
 * @openapi
 * /api/package/{id}:
 *   put:
 *     description: Update an existing Learning Package
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Learning Package to update
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LearningPackageNoId'
 *     responses:
 *       200:
 *         description: Learning Package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningPackageNoId'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Learning Package not found
 *       500:
 *         description: Server error
 */
app.put('/api/package/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, description, category, targetAudience, difficulty, learningPackage, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, category = _a.category, targetAudience = _a.targetAudience, difficulty = _a.difficulty;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                if (!id) {
                    res.status(400).json({ error: 'ID invalide ou manquant.' });
                }
                return [4 /*yield*/, LearningPackage_1.default.findByPk(id)];
            case 2:
                learningPackage = _b.sent();
                if (!!learningPackage) return [3 /*break*/, 3];
                res.status(404).json({ message: 'Learning package non trouve' });
                return [3 /*break*/, 6];
            case 3:
                if (learningPackage) {
                    learningPackage.set({
                        title: title,
                        description: description,
                        category: category,
                        targetAudience: targetAudience,
                        difficulty: difficulty,
                    });
                }
                if (!learningPackage) return [3 /*break*/, 5];
                return [4 /*yield*/, learningPackage.save()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.status(200).json({
                    message: 'Learning package mis à jour avec succes',
                    data: learningPackage,
                });
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.error('Erreur lors de la mise à jour du learning package', error_1);
                res.status(500).json({ message: 'Erreur serveur', error: error_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
/*app.put('/api/package', (req: Request, res: Response) => {
    let item = <LearningPackage>req.body;
    console.log('handle http PUT /api/package', item);
    const id = item.id;
    const idx = learningPackages.findIndex((x) => x.id === id);
    if (idx !== -1) {
        const found = learningPackages[idx];
        if (item.title) {
            found.title = item.title;
        }
        if (item.description) {
            found.description = item.description;
        }
        if (item.category) {
            found.category = item.category;
        }
        if (item.targetAudience) {
            found.targetAudience = item.targetAudience;
        }
        if (item.difficulty) {
            found.difficulty = item.difficulty;
        }
        res.send(found);
    } else {
        res.status(404).send('Learning Package entity not found by id:' + id);
    }
});
*/
/**
 * @openapi
 * /api/package-summaries:
 *   get:
 *     description: Get all learning packages with id and title fields only
 *     responses:
 *       200:
 *         description: An array of LearningPackage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningPackage'
 */
/*app.get('/api/package-summaries', (req, res) => {
    const packageSummaries = learningPackages.map(item => ({
        id: item.id,
        title: item.title,
    }));
    res.status(200).json(packageSummaries);
});*/
// Endpoints Learningfact
/*app.post('/api/package/:id/fact', async (req: Request, res: Response) => {
    try {
        const newFact = await LearningFact.create(req.body);
        res.status(201).json(newFact);
    } catch (err) {
        console.error('Erreur lors de la création du fact :', err);
        res.status(500).json({error: 'Erreur interne du serveur.'});

        console.error('Erreur lors de la création du package :', err);
        res.status(400).json({error: 'Erreur lors de la validation ou de la création.'});
    }
});*/
// app.patch()
console.log('starting...');
app.listen(3000, function () {
    console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
});
