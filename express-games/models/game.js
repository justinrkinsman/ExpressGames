const mongoose = require("mongoose")

const Schema = mongoose.Schema

const GameSchema = new Schema({
    title: { type: String, required: true },
    console: { type: Schema.Types.ObjectId, ref: "Console", required: true },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
    developer: { type: String },
    publisher: { type: String },
    release_date: { type: Date },
    cost: { type: String },
})

// Virtual for console's URL
GameSchema.virtual("url").get(function () {
    return "/catalog/game/" + this.id
})

module.exports = mongoose.model("Game", GameSchema)