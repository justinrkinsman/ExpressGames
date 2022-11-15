const Console = require("../models/console")
const Game = require('../models/game')
const async = require("async")

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
exports.console_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Console create GET")
}

// Handle Console create on POST.
exports.console_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Console create POST")
}

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