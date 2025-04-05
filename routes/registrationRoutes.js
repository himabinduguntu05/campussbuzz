const express = require("express");
const mongoose = require("mongoose");

const Registration = require("../models/Registration");
const Student = require("../models/Student");  // Import the Student model


const router = express.Router();
const Event = require("../models/Event");
// Register for an event
router.post("/register", async (req, res) => {
  try {
    // Expecting student details along with eventId
    console.log("Incoming registration request:", req.body);
    const { studentId,name, branch,section, phone, eventId } = req.body;
    
    // Check if the student is already registered for the event
    const existingRegistration = await Registration.findOne({ eventId, studentId });
    if (existingRegistration) {
      return res.status(400).json({ error: "Already registered for this event" });
    }
    const studentObjectId = mongoose.Types.ObjectId.isValid(studentId) ? studentId : new mongoose.Types.ObjectId(studentId);
const eventObjectId = mongoose.Types.ObjectId.isValid(eventId) ? eventId : new mongoose.Types.ObjectId(eventId);


    
    // Create new registration
    const newRegistration = new Registration({ studentId:studentObjectId, name, branch, section, phone, eventId :eventObjectId,});
    await newRegistration.save();
    
    res.status(201).json({ message: "Successfully registered", newRegistration });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Error registering for event" });
  }
});




router.post("/unregister", async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    if (!studentId || !eventId) {
      return res.status(400).json({ error: "Missing studentId or eventId" });
    }

    const result = await Registration.findOneAndDelete({
      studentId,eventId
    });

    if (!result) {
      return res.status(404).json({ error: "Registration not found" });
    }

    res.json({ message: "Successfully unregistered" });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    res.status(500).json({ error: "Error unregistering from event" });
  }
});


// router.get("/event/:eventCategory", async (req, res) => {
//   try {
//     const eventCategory = req.params.eventCategory;
//     console.log("fetching students for event category:",eventCategory);
//     // Find events that match the category
//     const events = await Event.find({ eventCategory });

//     if (!events.length) {
//       return res.status(404).json({ error: "No events found for this category" });
//     }

//     const eventIds = events.map(event => event._id);

//     // Find registrations linked to those event IDs
//     const students = await Registration.find({ eventId: { $in: eventIds } });
//     console.log("Registered students data:", students); 
//     res.json(students);
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.get("/event/:eventCategory", async (req, res) => {
  try {
    const { eventCategory } = req.params;

    if (!eventCategory) {
      return res.status(400).json({ error: "Event category is required" });
    }

    // Find events matching the selected event category
    const events = await Event.find({ eventCategory });

    if (!events.length) {
      return res.status(404).json({ error: "No events found for this category" });
    }

    const eventIds = events.map(event => event._id);

    // Find registrations linked to the event IDs
    const registrations = await Registration.find({ eventId: { $in: eventIds } })
      .populate("studentId")
      .populate("eventId");

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching registered students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/:eventCategory", async (req, res) => {
  try {
    const { eventCategory } = req.params;

    // Fetch event IDs that match the category
    const eventIds = await Event.find({ eventCategory }).distinct("_id");

    // Count registrations based on event type
    const competitionsCount = await Registration.countDocuments({
      eventId: { $in: eventIds },
      type: "Competitions", // Change "category" to "type"
    });

    const socialEventsCount = await Registration.countDocuments({
      eventId: { $in: eventIds },
      type: "Social Events",
    });

    const funGamesCount = await Registration.countDocuments({
      eventId: { $in: eventIds },
      type: "Fun Games",
    });

    res.json({
      competitions: competitionsCount || 0,
      socialEvents: socialEventsCount || 0,
      funGames: funGamesCount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

// Get registered events for a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const registrations = await Registration.find({ studentId }).populate("eventId");
     // Extract event IDs
     const registeredEventIds = registrations.map(reg => reg.eventId._id);
     res.json({ registeredEvents: registeredEventIds });
  } catch (error) {
    res.status(500).json({ error: "Error fetching registered events" });
  }
});

module.exports = router;
