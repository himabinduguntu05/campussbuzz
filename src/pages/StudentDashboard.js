

import { useCallback } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);
  const [unregisterEvent, setUnregisterEvent] = useState(null);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId") || ""; // Assuming student ID is stored after login

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    id: studentId || "",
    section: "",
    phone: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("studentId"); // Clear the studentId from localStorage
    navigate("/"); // Redirect to the home page
  };


  useEffect(() => {
    if (studentId) {
      fetch(`http://localhost:5000/api/registrations/student/${studentId}`)
        .then((res) => res.json())
        .then((data) => setRegisteredEvents(data.registeredEvents || []))
        .catch((err) => console.error("Error fetching registered events:", err));
    }
  }, [studentId]);

  const openModal = (eventId) => {
    setCurrentEvent(eventId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", branch: "",section: "", phone: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!studentId || studentId.trim() === "") {  // Ensure studentId is valid
      console.error("Student ID is missing.");
      return;
    }
    fetch("http://localhost:5000/api/registrations/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        name: formData.name,
        branch: formData.branch,
        section: formData.section,
        phone: formData.phone,
        eventId: currentEvent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRegisteredEvents((prev)=>[...prev, currentEvent]);
        fetchRegisteredStudents();
        closeModal();
      })
      .catch((err) => console.error("Error registering:", err));
  };

  const confirmUnregister = (eventId) => {
    setUnregisterEvent(eventId);
    setShowUnregisterModal(true);
  };

  const handleUnregister = () => {
    console.log("Registering for event with ID:", currentEvent);  // ✅ Add this

    fetch("http://localhost:5000/api/registrations/unregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId:studentId.trim(), eventId: unregisterEvent }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRegisteredEvents((prev) => prev.filter((id) => id !== unregisterEvent));
        setShowUnregisterModal(false);
        fetchRegisteredStudents(selectedCategory);
      })
      .catch((err) => console.error("Error unregistering:", err));
  };
 
 

const fetchRegisteredStudents = useCallback(async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/registrations/student/${studentId}`);
    const data = await response.json();
    setRegisteredEvents(data.registeredEvents || []);
  } catch (error) {
    console.error("Error fetching registered students:", error);
  }
}, [studentId]); // Ensure it updates when studentId changes

useEffect(() => {
  fetchRegisteredStudents();
}, [fetchRegisteredStudents]);

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.eventCategory === selectedCategory);

  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <h3>Events</h3>
        {["All", "NSS", "HHO", "OrnateFest", "Independence Day", "Republic Day"].map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
          
        ))}
        <button onClick={handleLogout} className="logout-btn">Logout</button> 
      </div>
      <div className="content">
        <h2>{selectedCategory} Events</h2>
        <div className="event-list">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <img src={event.image} alt={event.name} />
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <p>Location: {event.location}</p>
              {registeredEvents.includes(event._id) ? (
                <button className="unregister-btn" onClick={() => confirmUnregister(event._id)}>
                  Unregister
                </button>
              ) : (
                <button className="register-btn" onClick={() => openModal(event._id)}>
                  Register
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Register for Event</h3>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} />
      <input type="text" name="section" placeholder="Section" value={formData.section} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
      <button onClick={handleRegister} className="register-btn">Register</button>
      <button onClick={closeModal} className="cancel-btn">Cancel</button>
    </div>
  </div>
)}


      {showUnregisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to unregister?</h3>
            <button onClick={handleUnregister} className="register-btn">Yes</button>
            <button onClick={() => setShowUnregisterModal(false)} className="cancel-btn">No</button>
          </div>
        </div>
      )}
            <style>
        {`
          .student-dashboard {
            display: flex;
            height: 100vh;
            background-color: #1c1d1e;
          }
          .sidebar {
            width: 250px;
            background-color: black;
            padding: 20px;
          }
          .sidebar h3 {
            color: #DABFDE;
            margin-bottom: 20px;
          }
          .sidebar button {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 10px;
            border: none;
            background-color: #1c1d1e;
            color: #DABFDE;
            cursor: pointer;
          }
          .sidebar button.active, .sidebar button:hover {
            background-color: #bca0c8;
            color: black;
          }
          .content {
            flex: 1;
            padding: 20px;
          }
          .content h2 {
            color: #DABFDE;
          }
          .event-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          .event-card {
            background-color: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            width: 250px;
            border: 2px solid black;
          }
          .event-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 5px;
          }
          .register-btn, .unregister-btn {
            margin-top: 10px;
            padding: 10px;
            width: 100%;
            border-radius: 5px;
            border: 2px solid black;
            cursor: pointer;
            font-size: 14px;
          }
          .register-btn {
            background-color: #DABFDE;
            color: black;
          }
          .register-btn:hover {
            background-color: #bca0c8;
          }
          .unregister-btn {
            background-color: red;
            color: white;
          }
          .unregister-btn:hover {
            background-color: darkred;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            text-align: center;
          }
          .modal-content input {\n            display: block;\n            width: 100%;\n            margin: 10px 0;\n            padding: 10px;\n          }\n          .cancel-btn {\n            background: gray;\n            margin-top: 10px;\n            color: white;\n            border: none;\n            padding: 10px;\n            width: 100%;\n            border-radius: 5px;\n          }\n        `}
      </style>
    </div>
  );
};

export default StudentDashboard;
