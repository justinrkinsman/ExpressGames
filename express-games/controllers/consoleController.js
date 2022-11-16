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
exports.console_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Console delete GET")
}

// Handle Console delete on POST.
exports.console_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Console delete POST")
}

// Display Console update form on GET.
exports.console_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Console update GET")
}

exports.console_update_post = (req,res) => {
    res.send("NOT IMPLEMENTED: Console update POST")
}