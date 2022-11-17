const GameInstance = require("../models/gameinstance")
const { body, validationResult } = require("express-validator")
const Game = require("../models/game")

// Display list of all GameInstances.
exports.gameInstance_list = function (req, res, next) {
    GameInstance.find()
        .populate("game")
        .exec(function (err, list_gameinstances) {
            if (err) {
                return next(err)
            }
            // Successful, so render
            res.render("gameinstance_list", {
                title: "Game Copies List",
                gameinstance_list: list_gameinstances,
            })
        })
}

// Display detail page for a specific GameInstance.
exports.gameInstance_detail = (req, res, next) => {
    GameInstance.findById(req.params.id)
        .populate('game')
        .exec((err, gameinstance) => {
            if (err) {
                return next(err)
            }
            if (gameinstance == null) {
                // No results.
                const err = new Error("Game copy not found")
                err.status = 404
                return next(err)
            }
            // Successful, so render.
            res.render("gameinstance_detail", {
                title: `Copy: ${gameinstance.game.title}`, gameinstance,
                id: req.params.id
            })
        })
    }

// Display GameInstance create form on GET.
exports.gameInstance_create_get = (req, res, next) => {
    Game.find({}, "title").exec((err, games) => {
        if (err) {
            return next(err)
        }
        // Successful, so render.
        res.render("gameinstance_form", {
            title: "Create GameInstance",
            game_list: games,
        })
    })
}

// Handle GameInstance create on POST.
exports.gameInstance_create_post = [
    // Validate and sanitize fields.
    body("game", "Game must be specified").trim().isLength({ min: 1}).escape(),
    body("status").escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        // Create a GameInstance object with escaped and trimmed data.
        const gameinstance = new GameInstance({
            game: req.body.game,
            status: req.body.status,
        })

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Game.find({}, "title").exec(function (err, games) {
                if (err) {
                    return next(err)
                }
                // Successful, so render.
                res.render("gameinstance_form", {
                    title: "Create GameInstance",
                    game_list: games,
                    selected_game: gameinstance.game._id,
                    errors: errors.array(),
                    gameinstance,
                })
            })
            return
        }

        // Data from form is valid.
        gameinstance.save((err) => {
            if (err) {
                return next(err)
            }
            // Successful: redirect to new record.
            res.redirect(gameinstance.url)
        })
    },
]

// Display GameInstance delete form on GET.
exports.gameInstance_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: GameInstance delete GET")
}

// Handle GameInstance delete on POST.
exports.gameInstance_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: GameInstance delete POST")
}

// Display GameInstance update form on GET.
exports.gameInstance_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: GameInstance update GET")
}

// Handle GameInstance update on POST.
exports.gameInstance_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: GameInstance update POST")
}