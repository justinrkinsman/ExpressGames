const mongoose = require("mongoose")

const Schema = mongoose.Schema

const GameSchema = new Schema({
    title: { type: String, required: true, maxLength: 100, minLength: 1 },
    console: { type: Schema.Types.ObjectId, ref: "Console", required: true },
    developer: { type: String },
    publisher: { type: String },
    release_date: { type: Date },
    cost: { type: String },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
})

// Virtual for console's URL
ConsoleSchema.virtual("url").get(function () {
    return `/catalog/game/${this.id}`
})

module.exports = mongoose.model("Game", GameSchema)