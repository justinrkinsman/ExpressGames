const mongoose = require("mongoose")
const { DateTime } = require('luxon')

const Schema = mongoose.Schema

const GameSchema = new Schema({
    title: { type: String, required: true },
    console: { type: Schema.Types.ObjectId, ref: "Console", required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre", required: true }],
    developer: { type: String },
    publisher: { type: String },
    release_date: { type: Date },
    cost: { type: String },
})

// Virtual for console's URL
GameSchema.virtual("url").get(function () {
    return "/catalog/game/" + this.id
})

GameSchema.virtual("release_date_formatted").get(function () {
    return DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED)
})

module.exports = mongoose.model("Game", GameSchema)