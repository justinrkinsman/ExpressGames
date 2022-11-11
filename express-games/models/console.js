const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ConsoleSchema = new Schema({
    name: { type: String, required: true, maxLength: 100, minLength: 1 },
    release_year: { type: Number, minLength: 4, maxLength: 4 },
    manufacturer: { type: String },
    discontinued: { type: Number, minLength: 4, maxLength: 4 },
    units_sold: { type: String }
})

// Virtual for console's URL
ConsoleSchema.virtual("url").get(function () {
    return `/catalog/console/${this.id}`
})

module.exports = mongoose.model("Console", ConsoleSchema)