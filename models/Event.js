

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  deadline: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true }, // Ensure this exists
  eventCategory: { type: String, required: true } // Matches selectedEvent
});

module.exports = mongoose.model("Event", EventSchema);

