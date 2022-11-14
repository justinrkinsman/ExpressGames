const Console = require("../models/console")

// Display list of all Consoles
exports.console_list = (req, res) => {
    res.send("NOT IMPLEMENTED: Console list")
}

// Display detail page for a specific Console.
exports.console_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Console detail: ${req.params.id}`)
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