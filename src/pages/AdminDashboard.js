



import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./adminDashboard.css";
import chartConfig from "./chartConfig"; 
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    location: "",
    image: "",
    deadline: "",
    time: "",
    type: "",
  });
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [showVisualize, setShowVisualize] = useState(false);
  const [chartPopup, setChartPopup] = useState(null);

  const navigate = useNavigate();


  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from the server
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem('authToken'); // Adjust this based on your auth implementation
    // Redirect to the home page
    navigate('/');
  };
  
  
  const fetchRegisteredStudents = async (eventCategory) => {
    if (!eventCategory) return;  // Prevent unnecessary API calls
  
    try {
      const response = await fetch(`http://localhost:5000/api/registrations/event/${eventCategory}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch registered students");
      }
  
      const data = await response.json();
      console.log("Fetched students data:", data);
  
      // Ensure it's an array before updating state
      setRegisteredStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching registered students:", error);
      setRegisteredStudents([]); // Reset on error
    }
  };
  
  useEffect(() => {
    if (selectedEvent) {
      console.log("Fetching students for event:", selectedEvent);
      fetchRegisteredStudents(selectedEvent);
    }
  }, [selectedEvent]);  // Runs only when `selectedEvent` changes
  
  
  // Handle form input changes
  const handleChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleEventClick = (eventName) => {
    setSelectedEvent(eventName);
    setShowVisualize(false); // Hide visualization when clicking an event
    setChartPopup(null); // Hide all charts when switching events
  };
  const toggleChartPopup = (chartId) => {
    setChartPopup(chartPopup=== chartId ? null : chartId);};
  
  // Handle opening the modal and setting event type
  const handleOpenModal = (eventType) => {
    setEventForm({ ...eventForm, type: eventType }); // Set event type
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventForm.name || !eventForm.date || !eventForm.image || !eventForm.deadline || !eventForm.time || !eventForm.location) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eventForm, eventCategory: selectedEvent }),
      });
      if (!response.ok) {
        throw new Error("Failed to add event");
      }
  
      const data = await response.json();
      console.log("Event added:", data);
      
      setShowModal(false);
      setEventForm({ name: "", date: "", location: "", image: "", deadline: "", time: "", type: "" });
      fetchEvents(); 
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event!");
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEvents(); // Refresh event list
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        {["NSS", "HHO", "OrnateFest","Independence Day","Republic Day"].map((event) => (
          <button key={event} onClick={() => handleEventClick(event)}>
            {event}
          </button>
        ))}
          <button onClick={() => {setShowVisualize(!showVisualize);
          setSelectedEvent(null);
          setChartPopup(null);
         }}>
          Visualize 📊
        </button> 
        <button onClick={handleLogout}>Logout</button>
      </div>


    

      {/* Main Content */}
      <div className="content">
        {selectedEvent && (
          <>
            <h2>{selectedEvent} Management</h2>

            {/* Event Options */}
            <div className="event-options">
              {["Competitions", "Social Events", "Fun Games"].map((type) => (
                <div key={type} className="event-box" onClick={() => handleOpenModal(type)}>
                  {type}
                </div>
              ))}
            </div>

            {/* Event List */}
            <div className="event-list">
              {events
                .filter((event) => event.eventCategory === selectedEvent)
                .map((event) => (
                  <div key={event._id} className="event-card">
                    <img src={event.image} alt={event.name} />
                    <h4>{event.name}</h4>
                    <p>{event.date} | {event.location}</p>
                    <button onClick={() => handleDeleteEvent(event._id)}>❌ Delete</button>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>



  {/* Show Visualization Buttons if Visualize is Selected */}
  {showVisualize && !selectedEvent && (
          <div className="visualize-btn">
            <button className="stats-btn" onClick={() => toggleChartPopup(chartConfig.totalRegistrations)}>Total Registrations</button>
            <button className="stats-btn" onClick={() => toggleChartPopup(chartConfig.EventTypes)}>EventTypes</button>
            {["NSS", "HHO", "Ornate", "Independence", "Republic"].map((event) => (
              <button className="stats-btn" key={event} onClick={() => toggleChartPopup(chartConfig[event])}>
                {event} Registrations
              </button>
            ))}
          </div>
        )}
 {/* Pie Chart Popup */}
 {chartPopup && (
        <div className="visual-popup">
          <div className="visual-popup-content">
            <button className="close-visual-btn" onClick={() => setChartPopup(null)}>✖ Close</button>
            <iframe
             className="visual-chart"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              width="640"
              height="480"
              src={`https://charts.mongodb.com/charts-project-0-lucqxnl/embed/charts?id=${chartPopup}`}
            ></iframe>
          </div>
        </div>
      )}

       

      {/* Modal for Adding Events */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Event - {eventForm.type}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Event Name" value={eventForm.name} onChange={handleChange} required />
              <input type="date" name="date" placeholder="Event Date" value={eventForm.date} onChange={handleChange} required />
              <input type="text" name="image" placeholder="Image URL" value={eventForm.image} onChange={handleChange} required />
              <input type="date" name="deadline" placeholder="Registration Deadline" value={eventForm.deadline} onChange={handleChange} required />
              <input type="time" name="time" placeholder="Event Time" value={eventForm.time} onChange={handleChange} required />
              <input type="text" name="location" placeholder="Location" value={eventForm.location} onChange={handleChange} required />

              <button type="submit">Add Event</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
  
{/* Break to separate events from the table */}
<br />
<br />
{selectedEvent && (
  <>
    {registeredStudents.length > 0 ? (
      <div className="registered-students">
        <h3>Registered Students for {selectedEvent}</h3>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Branch</th>
              <th>Section</th>
              <th>Phone</th>
              <th>Event Name</th>
            </tr>
          </thead>
          <tbody>
            {registeredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.name || "N/A"}</td>
                <td>{student.branch || "N/A"}</td>
                <td>{student.section || "N/A"}</td>
                <td>{student.phone || "N/A"}</td>
                <td>{student.eventId?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No registered students found for {selectedEvent}.</p>
    )}
  </>
)}

    </div>
  );
};

export default AdminDashboard;








