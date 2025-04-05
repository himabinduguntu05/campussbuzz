




import React, {useState} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import nssImage from "../pages/nss1.jpeg";
import hhoImage from "../pages/hho.jpeg";
import ornateImg from "../pages/ornate.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 


function Home() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

const handleNavClick = (event, path) => {
  event.preventDefault();  // Prevent default navigation

  const token = localStorage.getItem("token");  // Check if logged in

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "You must log in first to access this section!",
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");  // Redirect to login page
      }
    });
  } else {
    navigate(path);  // Allow navigation if logged in
  }
};
  return (
    <div>
      {/* Horizontal Navbar */} 
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#DABFDE",height:"70px" }}>
        <div className="container-fluid">
          <a className="navbar-brand" style={{color:"black"}}href="#"><img src="/favicon1.jpeg" height="30px" width="30px"/>Campus Buzz</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isNavOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={() => setIsNavOpen(!isNavOpen)} // Toggle state
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link"  style={{color:"black"}} href="#">Contact</a></li>
              <li className="nav-item"><a className="nav-link" style={{color:"black"}} href="#">Blogs</a></li>
              <li className="nav-item">
  <Link className="nav-link" style={{color:"black"}} to="/register">Register</Link></li>

              <li className="nav-item"><Link className="nav-link" style={{color:"black"}} to="/Login">Login</Link></li>
            

            </ul>
          </div>
        </div>
      </nav>
      {/* Main Layout */}
      <div className={`container-fluid ${isNavOpen ? "push-down" : ""}`}>
        <div className="row">
          {/* Sidebar (Vertical Navbar) */}
          <div className="col-md-3 sidebar">
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link active" to="#" onClick={(e) => handleNavClick(e, "/nss")}>NSS</Link></li>
              <li className="nav-item"><Link className="nav-link" to="#" onClick={(e) => handleNavClick(e, "/hho")}>HHO</Link></li>
              <li className="nav-item"><Link className="nav-link" to="#" onClick={(e) => handleNavClick(e, "/ornate")}>Ornate</Link></li>
              <li className="nav-item"><Link className="nav-link" to="#" onClick={(e) => handleNavClick(e, "/independence-day")}>Independence Day</Link></li>
              <li className="nav-item"><Link className="nav-link" to="#" onClick={(e) => handleNavClick(e, "/republic-day")}>Republic Day</Link></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-md-9 content">
            {/* Title */}
            <h1 className="title">Campus Buzz</h1>
            {/* Events Grid */}
            <div className="row event-grid">
              <div className="col-md-4">
                <div className="card">
                  <img src={nssImage} className="card-img-top" alt="Event" />
                  <div className="card-body">
                    <h5 className="card-title">NSS Event</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <img src={hhoImage} className="card-img-top" alt="Event" height="30px" width="30px" />
                  <div className="card-body">
                    <h5 className="card-title">HHO Event</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <img src={ornateImg} className="card-img-top" alt="Event" />
                  <div className="card-body">
                    <h5 className="card-title">Ornate Event</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
   
    {/* Blogs Section */}
    <section className="blogs-section">
    <h2 className="text-center">Latest Blogs</h2>
    <div className="row">
      <div className="col-md-4">
        <div className="card blog-card">
          <div className="card-body">
            <h5 className="card-title">The Impact of NSS Activities</h5>
            <p className="card-text">Explore how NSS is bringing change in the community through social activities.</p>
            <a href="#" className="btn btn-primary">Read More</a>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card blog-card">
          <div className="card-body">
            <h5 className="card-title">HHO: The Road to Innovation</h5>
            <p className="card-text">Learn about the latest projects undertaken by HHO and their future plans.</p>
            <a href="#" className="btn btn-primary">Read More</a>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card blog-card">
          <div className="card-body">
            <h5 className="card-title">Fest Highlights</h5>
            <p className="card-text">A glimpse into the most exciting moments from the recent campus festival.</p>
            <a href="#" className="btn btn-primary">Read More</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  {/* Contact Section */}
  <section className="contact-section">
    <h2 className="text-center">Contact Information</h2>
    <div className="row">
      <div className="col-md-6">
        <h3>Event Coordinators</h3>
        <ul>
          <li><strong>NSS:</strong> Sowmya</li>
          <li><strong>HHO:</strong> Nagaraj Naik</li>
          <li><strong>Ornate:</strong> Rupas Kumar</li>
          <li><strong>Independence Day & Republic Day:</strong> Mallikarjuna</li>
        </ul>
      </div>
      <div className="col-md-6">
        <h3>Developers</h3>
        <ul>
          <li>Guntu Hima Bindu - <a href="mailto:ro200708@rguktong.ac.in">ro200708@rguktong.ac.in</a></li>
          <li>Bhavana - <a href="mailto:ro200283@rguktong.ac.in">ro200283@rguktong.ac.in</a></li>
          <li>Ram Karthik - <a href="mailto:ro200661@rguktong.ac.in">ro200661@rguktong.ac.in</a></li>
          <li>Eeswar - <a href="mailto:ro200032@rguktong.ac.in">ro200032@rguktong.ac.in</a></li>
        </ul>
      </div>
    </div>
  </section>
  {/* Footer Section */}
  <footer className="footer text-center">
        <p>&copy; {new Date().getFullYear()} Campus Buzz. All rights reserved.</p>
        <div className="social-icons">
          <a href="#" className="icon"><i className="fab fa-google"></i></a>
          <a href="#" className="icon"><i className="fab fa-linkedin"></i></a>
          <a href="#" className="icon"><i className="fab fa-facebook"></i></a>
          <a href="#" className="icon"><i className="fab fa-instagram"></i></a>
        </div>
      </footer>
      <style>
        {`
          /* ✅ When collapsed, menu items appear vertically */
          @media (max-width: 991px) {
            .navbar-collapse {
              background: white;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
              margin-top:10px;
            }
            .navbar-nav {
              flex-direction: column;
            }
            .push-down {
              margin-top: 200px; /* Push sidebar down when menu opens */
            }
          }
        .navbar-nav .nav-item .nav-link:hover {
  background:#DABFDE;
        color:black !important; /* Purple color */
  font-weight: bold;
}`}
      </style>
  </div>
  );
}

export default Home;

