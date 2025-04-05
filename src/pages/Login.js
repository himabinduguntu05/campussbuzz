import React, { useState,useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
//import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");
  
    try {
      // Send OTP request
      const otpResponse = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email ,role}),
      });
  
      const otpData = await otpResponse.json();
      if (otpResponse.status !== 200) {
        alert(otpData.error || "Failed to send OTP");
        return;
      }
  
      const otp = prompt("Enter the OTP sent to your email:");
      if (!otp) return;
  
      // Verify OTP
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp ,role }),
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        alert(data.error || "Invalid OTP");
        return;
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      if (role === "student") {
        localStorage.setItem("studentId", data.studentId);  // Store studentId
      } else {
        localStorage.setItem("adminId", data.adminId);  // Store adminId
      }
      alert("Login successful!");
      
      //Use AuthContext login function to update user state
      login({ email: email, role: data.role });
      
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };
  
  

  return (
    <div className="container login-container">
      <h2 className="text-center" style={{ color: "#DABFDE" }}>Login</h2>

      <div className="d-flex justify-content-center">
        <div className="btn-group">
          <button
            className={`btn ${role === "student" ? "btn-black" : "btn-outline-black"}`}
            style={{ backgroundColor: role === "student" ? "#DABFDE" : "transparent", color: "black" }}
            onClick={() => setRole("student")}
          >
            Login as Student
          </button>
          <button
            className={`btn ${role === "admin" ? "btn-black" : "btn-outline-black"}`}
            style={{ backgroundColor: role === "admin" ? "#DABFDE" : "transparent", color: "black" }}
            onClick={() => setRole("admin")}
          >
            Login as Admin
          </button>
        </div>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderColor: "black", outlineColor: "black" }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderColor: "black", outlineColor: "black" }}
            required
          />
        </div>

        <button type="submit" className="btn w-100" style={{ borderColor: "black", backgroundColor: "#DABFDE", color: "white" }}>
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>
    </div>
  );
};

export default Login;
