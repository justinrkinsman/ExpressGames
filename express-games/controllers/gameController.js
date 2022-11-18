const Game = require("../models/game")
const Console = require("../models/console")
const Genre = require("../models/genre")
const GameInstance = require("../models/gameinstance")
const { body, validationResult } = require("express-validator")

const async = require("async")

exports.index = function (req, res) {
    async.parallel(
        {
            game_count: function(callback) {
                Game.countDocuments({}, callback) // Pass an empty object as match condition to find all documents of this collection
            },
            game_instance_count: function(callback) {
                GameInstance.countDocuments({}, callback)
            },
            game_instance_available_count: function(callback) {
                GameInstance.countDocuments({ status: "Available" }, callback)
            },
            console_count: function(callback) {
                Console.countDocuments({}, callback)
            },
            genre_count: function(callback) {
                Genre.countDocuments({}, callback)
            },
        },
        function (err, results) {
            res.render("index", {
                title: "Express Games Home",
                error: err,
                data: results,
            })
        }
    )
}

// Display list of all games.
exports.game_list = function (req, res, next) {
    Game.find({}, "title console genre")
        .sort({ title: 1 })
        .populate("console genre")
        .exec(function (err, list_games) {
            if (err) {
                return next(err)
            }
            // Successful, so render
            res.render("game_list", { title: "Game List", game_list: list_games })
        })
}

// Display detail page for a specific game.
exports.game_detail = (req, res, next) => {
    async.parallel(
        {
            game(callback) {
                Game.findById(req.params.id)
                    .populate("console")
                    .populate("genre")
                    .exec(callback)
            },
            game_instance(callback) {
                GameInstance.find({ game: req.params.id }).exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            if (results.game === null) {
                // No results.
                const err = new Error("Game not found")
            }
            // Successful, so render.
            res.render("game_detail", {
                title: results.game.title,
                game: results.game,
                game_instances: results.game_instance,
            })
        }
    )
}

// Display game create form on GET.
exports.game_create_get = (req, res, next) => {
    // Get all consoles and genres, which we can use for adding to our game
    async.parallel(
        {
            consoles(callback) {
                Console.find(callback)
            },
            genres(callback) {
                Genre.find(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            res.render("game_form", {
                title: "Create Game",
                consoles: results.consoles,
                genres: results.genres,
            })
        }
    )
}

// Handle game create on POST.
exports.game_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') req.body.genre = []
            else req.body.genre = new Array(req.body.genre)
        }
        next()
    },

    // Validate and sanitize fields
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("console", "Console must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("developer", "Developer must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('publisher', "Publisher must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('release_date', "Release date must not be empty.")
        .trim()
        .isISO8601()
        .toDate(),
    body('cost', "Cost must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*").escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        // Create a Game object with escaped and trimmed data.
        const game = new Game({
            title: req.body.title,
            console: req.body.console,
            developer: req.body.developer,
            publisher: req.body.publisher,
            release_date: req.body.release_date,
            cost: req.body.cost,
            genre: req.body.genre,
        })

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all consoles and genres for form.
            async.parallel(
                {
                    consoles: function (callback) {
                        Console.find(callback)
                    },
                    genres: function (callback) {
                        Genre.find(callback)
                    },
                },
                function (err, results) {
                    if (err) {
                        return next(err)
                    }

                    // Mark out selected genres as checked.
                    for (let i = 0; i < results.genres.length; i++) {
                        if (game.genre.indexOf(results.genres[i]._id) > - 1) {
                            results.genres[i].checked = 'true'
                        }
                    }
                    res.render("game_form", {
                        title: "Create Game",
                        consoles: results.consoles,
                        genres: results.genres,
                        game,
                        errors: errors.array(),
                    })
                }
            )
            return
        }

        // Data from form is valid. Save game.
        game.save((err) => {
            if (err) {
                return next(err)
            }
            // Successful: redirect to new game record.
            res.redirect(game.url)
        })
    },
]

// Display game delete form on GET.
exports.game_delete_get = (req, res, next) => {
    async.parallel(
        {
            game(callback) {
                Game.findById(req.params.id).exec(callback)
            },
            games_gameinstances(callback) {
                GameInstance.find({ game: req.params.id }).exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            // Successful, so render.
            res.render("game_delete", {
                title: "Delete Game",
                game: results.game,
                game_gameinstances: results.games_gameinstances,
            })
        }
    )
}

// Handle game delete on POST.
exports.game_delete_post = (req, res, next) => {
    async.parallel(
        {
            game(callback) {
                Game.findById(req.body.gameid).exec(callback)
            },
            games_gameinstances(callback) {
                GameInstance.find({ game: req.body.gameid }).exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            // Success
            if (results.games_gameinstances.length > 0) {
                // Game has gameinstances. Render in the same way as for GET route
                res.render('game_delete', {
                    title: "Delete Game",
                    game: results.game,
                    game_gameinstances: results.games_gameinstances,
                })
                return
            } else {
            // Game has no instances. Delete object and redirect to the list of games
                Game.findByIdAndRemove(req.body.gameid, (err) => {
                    if (err) {
                        return next(err)
                    }
                    // Success - go to game list
                    res.redirect("/catalog/games")
                })
            }
        }
    )    
}

// Display game update form on GET.
exports.game_update_get = (req, res, next) => {
    // Get game, consoles and genres for form.
    async.parallel(
        {
            game(callback) {
                Game.findById(req.params.id)
                    .populate("console")
                    .populate("genre")
                    .exec(callback)
            },
            consoles(callback) {
                Console.find(callback)
            },
            genres(callback) {
                Genre.find(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            if (results.game == null) {
                // No results
                const err = new Error('Game not found')
                err.status = 404
                return next(err)
            }
            // Success.
            // Mark our selected genres as checked.
            for (const genre of results.genres) {
                for (const gameGenre of results.game.genre) {
                    if (genre._id.toString() === gameGenre._id.toString()) {
                        genre.checked = 'true'
                    }
                }
            }
            res.render("game_form", {
                title: "Update Game",
                consoles: results.consoles,
                genres: results.genres,
                game: results.game,
            })
        }
    )
}

// Handle game update on POST.
exports.game_update_post = [
    // Convert the genre to an array
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = 
                typeof req.body.genre === "undefined" ? [] : [req.body.genre]
        }
        next()
    },

    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("console", "Console must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('developer', "Developer must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('publisher', "Publisher must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('release_date', "Release date must not be empty.")
        .trim()
        .isISO8601()
        .toDate(),
    body('cost', "Cost must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*").escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        // Create a Game object with escaped/trimmed date and old id.
        const game = new Game({
            title: req.body.title,
            console: req.body.console,
            developer: req.body.developer,
            publisher: req.body.publisher,
            release_date: req.body.release_date,
            cost: req.body.cost,
            genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
            _id: req.params.id, //This is required, or a new ID will be assigned
        })

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            
            // Get all consoles and genres for form.
            async.parallel(
                {
                    consoles(callback) {
                        Console.find(callback)
                    },
                    genres(callback) {
                        Genre.find(callback)
                    },
                },
                (err, results) => {
                    if (err) {
                        return next(err)
                    }

                    // Mark our selected genres as checked.
                    for (const genre of results.genres) {
                        if (game.genre.includes(genre._id)) {
                            genre.checked = 'true'
                        }
                    }
                    res.render("game_form", {
                        title: "Update Game",
                        consoles: results.consoles,
                        genres: results.genres,
                        game,
                        errors: errors.array(),
                    })
                }
            )
            return
        }

        // Data form form is valid. Update the record.
        Game.findByIdAndUpdate(req.params.id, game, {}, (err, thegame) => {
            if (err) {
                return next(err)
            }

            // Successful: redirect to game detail page.
            res.redirect(thegame.url)
        })
    }
]