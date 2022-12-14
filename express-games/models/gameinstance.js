const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true }, // reference to the associated game
  status: {
    type: String,
    required: true,
    enum: ["Available", "Sold Out"],
    default: "Available",
  },
});

// Virtual for gameinstance's URL
GameInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/gameinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("GameInstance", GameInstanceSchema);