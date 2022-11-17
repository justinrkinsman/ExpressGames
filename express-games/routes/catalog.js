const express = require("express")
const router = express.Router()

// Require controller modules.
const game_controller = require('../controllers/gameController')
const console_controller = require('../controllers/consoleController')
const genre_controller = require('../controllers/genreController')
const game_instance_controller = require('../controllers/gameInstanceController')

/// GAME ROUTES ///

// GET catalog home page.
router.get('/', game_controller.index)

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get('/game/create', game_controller.game_create_get)

// POST request for creating Game.
router.post('/game/create', game_controller.game_create_post)

// GET request to delete Game.
router.get('/game/:id/delete', game_controller.game_delete_get)

// POST request to delete Game.
router.post("/game/:id/delete", game_controller.game_delete_post)

// GET request to update Game.
router.get("/game/:id/update", game_controller.game_update_get)

// POST request to update Game.
router.post("/game/:id/update", game_controller.game_update_post)

// GET request for one Game.
router.get("/game/:id", game_controller.game_detail)

// GET request for list of all Game items.
router.get('/games', game_controller.game_list)


/// CONSOLE ROUTES ///


// GET request for creating Console. NOTE This must come before route for id (i.e. display console).
router.get('/console/create', console_controller.console_create_get)

// POST request for creating Console.
router.post("/console/create", console_controller.console_create_post)

// GET request to delete Console.
router.get('/console/:id/delete', console_controller.console_delete_get)

// POST request to delete Console.
router.post("/console/:id/delete", console_controller.console_delete_post)

// GET request to update Console.
router.get("/console/:id/update", console_controller.console_update_get)

// POST request to update Console.
router.post("/console/:id/update", console_controller.console_update_post)

// GET request for one Console.
router.get("/console/:id", console_controller.console_detail)

// GET request for list of all Consoles.
router.get("/consoles", console_controller.console_list)


/// GENRE ROUTES ///


// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get)

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post)

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get)

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post)

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get)

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post)

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail)

// GET request for list of all Genres.
router.get("/genres", genre_controller.genre_list)


/// GAMEINSTANCE ROUTES ///


// GET request for creating a GameInstance. NOTE This must come before route that display GameInstance (uses id).
router.get('/gameinstance/create', game_instance_controller.gameInstance_create_get)

// POST request for create GameInstance.
router.post('/gameinstance/create', game_instance_controller.gameInstance_create_post)

// GET request to delete GameInstance.
router.get("/gameinstance/:id/delete", game_instance_controller.gameInstance_delete_get)

// POST request to delete GameInstance.
router.post("/gameinstance/:id/delete", game_instance_controller.gameInstance_delete_post)

// GET request for one GameInstance.
router.get("/gameinstance/:id", game_instance_controller.gameInstance_detail)

// GET request for list of all GameInstances.
router.get('/gameinstances', game_instance_controller.gameInstance_list)

module.exports = router;