// const mongoose = require("mongoose");

// const RegistrationSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // if available
//   name: { type: String, required: true },
//   branch: { type: String, required: true },
//   section: { type: String, required: true },
//   phone: { type: String, required: true },
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }
// });

// module.exports = mongoose.model("Registration", RegistrationSchema);


const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Assuming you have a User model
    required: true,
  },
 
  name: { type: String, required: true },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  phone: { type: String, required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Assuming you have an Event model
    required: true,
  },
});

// Ensure a student cannot register twice for the same event
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
