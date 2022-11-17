const Console = require("../models/console")
const Game = require('../models/game')
const async = require("async")
const { body, validationResult } = require("express-validator")

// Display list of all Consoles
exports.console_list = function (req, res, next) {
    Console.find()
        .sort([["name", 'ascending']])
        .populate("name release_year discontinued")
        .exec(function (err, list_consoles) {
            if (err) {
                return next(err)
            }
            // Successful, so render
            res.render("console_list", {
                title: "Console List",
                console_list: list_consoles,
            })
        })
}

// Display detail page for a specific Console.
exports.console_detail = (req, res, next) => {
    async.parallel(
        {
            console(callback) {
                Console.findById(req.params.id).exec(callback)
            },
            console_games(callback) {
                Game.find({ console: req.params.id }, "title").exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                // Error in API usage.
                return next(err)
            }
            if (results.console == null) {
                // No results.
                const err = new Error("Console not found")
                err.status = 404
                return next(err)
            }
            // Successful, so render.
            res.render("console_detail", {
                title: "Console Detail",
                console: results.console,
                console_games: results.console_games,
            })
        }
    )
}

// Display Author create form on GET.
exports.console_create_get = (req, res, next) => {
    res.render("console_form", { title: "Create Console" })
}

// Handle Console create on POST.
exports.console_create_post = [
    // Validate and sanitize fields.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Console name must be specified."),
    body("manufacturer")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Manufacturer name must be specified."),
    body("release_year", "Invalid release year")
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage("Release year must be 4-digit number"),
    body("discontinued", "Invalid discontinued year")
        .optional({ checkFalsy: true})
        .isDecimal()
        .withMessage("Discontinued year must be 4 digit number"),
    body("unit_sold")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Units sold must be specified"),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors form a request.
        const errors = validationResult(req)
        
        // Create a Console object with escaped and trimmed data.
        const console = new Console({
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            release_year: req.body.release_year,
            discontinued: req.body.discontinued,
            unit_sold: req.body.unit_sold,
        })

        if (!errors.isEmpty()) {
            // There are no errors. Render form again with sanitized values/errors messages.
            res.render("console_form", {
                title: "Create Console",
                console: req.body,
                errors: errors.array(),
            })
            return
        } else {
            // Data from form is valid.
            // Check if Console with same name already exists.
            Console.findOne({ name: req.body.name }).exec((err, found_console) => {
                if (err) {
                    return next(err)
                }

                if (found_console) {
                    // Console exists, redirect to its detail page.
                    res.redirect(found_console.url)
                } else {
                    console.save((err) => {
                        if (err) {
                            return next(err)
                        }
                       // Successful = redirect to new console record.
                       res.redirect(console.url)
                    })
                }
            })
        }
    }
]

// Display Console delete form on GET.
exports.console_delete_get = (req, res, next) => {
    async.parallel(
        {
            console(callback) {
                Console.findById(req.params.id).exec(callback)
            },
            consoles_games(callback) {
                Game.find({ console: req.params.id}).exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            if (results.console == null) {
                // No results.
                res.redirect("/catalog/consoles")
            }
            // Successful, so render.
            res.render("console_delete", {
                title: "Delete Console",
                console: results.console,
                console_games: results.consoles_games,
            })
        }
    )
}

// Handle Console delete on POST.
exports.console_delete_post = (req, res, next) => {
    async.parallel(
        {
            console(callback) {
                Console.findById(req.body.consoleid).exec(callback)
            },
            consoles_games(callback) {
                Game.find({ console: req.body.consoleid }).exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            // Success
            if (results.consoles_games.length > 0) {
                // Console has games. Render in the same way as for GET route
                res.render('console_delete', {
                    title: "Delete Console",
                    console: results.console,
                    console_games: results.consoles_games,
                })
                return
            } else {
            // Console has no games. Delete object and redirect to the list of consoles
                Console.findByIdAndRemove(req.body.consoleid, (err) => {
                    if (err) {
                        return next(err)
                    }
                    // Success - go to author list
                    res.redirect("/catalog/consoles")
                })
            }
        }
    )    
}

// Display Console update form on GET.
exports.console_update_get = (req, res, next) => {
    // Get console for form.
    async.parallel(
        {
            console(callback) {
                Console.findById(req.params.id)
                    .populate("name")
                    .populate("manufacturer")
                    .populate("release_year")
                    .populate("discontinued")
                    .populate("unit_sold")
                    .exec(callback)
            },
            games(callback) {
                Game.find(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            if (results.console == null) {
                // No results
                const err = new Error('Console not found')
                err.status = 404
                return next(err)
            }
            // Success.
            res.render("console_form", {
                title: "Update Console",
                console: results.console,
                games: results.games
            })
        }
    )
}

// Handle console update on POST
exports.console_update_post = [
    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("manufacturer", "Manufacturer must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('release_year', "Release year must not be empty.")
        .trim()
        .isDecimal()
        .escape(),
    body('discontinued', "Discontinued year must not be empty.")
        .trim()
        .isDecimal()
        .escape(),
    body('unit_sold', "Units Sold must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        // Create a Game object with escaped/trimmed date and old id.
        const console = new Console({
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            release_year: req.body.release_year,
            discontinued: req.body.discontinued,
            unit_sold: req.body.unit_sold,
            _id: req.params.id, //This is required, or a new ID will be assigned
        })

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            
            // Get all games for form.
            async.parallel(
                {
                    games(callback) {
                        Game.find(callback)
                    },
                },
                (err, results) => {
                    if (err) {
                        return next(err)
                    }
                    res.render("console_form", {
                        title: "Console Game",
                        games: results.games,
                        console,
                        errors: errors.array(),
                    })
                }
            )
            return
        }

        // Data form form is valid. Update the record.
        Console.findByIdAndUpdate(req.params.id, console, {}, (err, theconsole) => {
            if (err) {
                return next(err)
            }

            // Successful: redirect to Console detail page.
            res.redirect(theconsole.url)
        })
    }
]