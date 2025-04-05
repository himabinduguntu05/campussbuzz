

const express = require("express");
const nodemailer = require("nodemailer");
const Event = require("../models/Event");
const User = require("../models/User"); 
const router = express.Router();

// Fetch all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Create a new event
router.post("/", async (req, res) => {
  try {
    const { name, date, location, image, deadline, time, type, eventCategory } = req.body;

    console.log("Received data:", req.body); // Debugging

    // Validate required fields
    if (!name || !date || !location || !image || !deadline || !time || !type || !eventCategory) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create and save event
    const newEvent = new Event({ name, date, location, image, deadline, time, type, eventCategory });
    await newEvent.save();

    // Fetch all registered students' emails
    const students = await User.find({ role: "student" }, "email");

    // Send email notifications
    sendEventNotification(students.map((s) => s.email), newEvent);

    res.status(201).json({ message: "Event created successfully", newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Error creating event" });
  }
});

const sendEventNotification = (emails, event) => {
  if (!emails.length) return; // No students to notify

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // App password (not regular password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(","), // Send to all registered students
    subject: `New Event: ${event.name} Added!`,
    html: `
      <h2>${event.name} is Now Open for Registration!</h2>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Deadline:</strong> ${event.deadline}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      // <a href="http://yourwebsite.com/login" style="display:inline-block; padding:10px 15px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
      //   See More Details
      // </a>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("Error sending email:", error);
    else console.log("Email sent:", info.response);
  });
};

// Delete an event by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Error deleting event" });
  }
});

module.exports = router;
