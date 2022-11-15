const GameInstance = require("../models/gameinstance")

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
exports.gameInstance_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: GameInstance create GET")
}

// Handle GameInstance create on POST.
exports.gameInstance_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: GameInstance create POST")
}

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