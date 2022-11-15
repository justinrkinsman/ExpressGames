const Game = require("../models/game")
const Console = require("../models/console")
const Genre = require("../models/genre")
const GameInstance = require("../models/gameinstance")

const async = require("async")

exports.index = (req, res) => {
    async.parallel(
        {
            game_count(callback) {
                Game.countDocuments({}, callback) // Pass an empty object as match condition to find all documents of this collection
            },
            game_instance_count(callback) {
                GameInstance.countDocuments({}, callback)
            },
            game_instance_available_count(callback) {
                GameInstance.countDocuments({ status: "Available" }, callback)
            },
            console_count(callback) {
                Console.countDocuments({}, callback)
            },
            genre_count(callback) {
                Genre.countDocuments({}, callback)
            },
        },
        (err, results) => {
            res.render("index", {
                title: "Express Games Home",
                error: err,
                data: results,
            })
        }
    )
}

// Display list of all games.
exports.game_list = (req, res) => {
    res.send("NOT IMPLEMENTED: Game list")
}

// Display detail page for a specific game.
exports.game_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Game detail: ${req.param.id}`)
}

// Display game create form on GET.
exports.game_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Game create GET")
}

// Handle game create on POST.
exports.game_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Game create POST")
}

// Display game delete form on GET.
exports.game_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Game delete GET")
}

// Handle game delete on POST.
exports.game_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Game delete POST')
}

// Display game update form on GET.
exports.game_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Game update GET")
}

// Handle book update on POST.
exports.game_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Book update POST")
}