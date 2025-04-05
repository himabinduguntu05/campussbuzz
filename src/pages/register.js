// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./register.css";

// function Register() {
//   const [userType, setUserType] = useState("student");
//   const [formData, setFormData] = useState({
//     name: "",
//     collegeId: "",
//     email: "",
//     password: "",
//     event: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const finalFormData = { 
//       ...formData, 
//       role: userType 
//     };
//     console.log("Form Data:", finalFormData);
//   };

//   return (
//     <div className="container register-container">
//       <h2 className="text-center" style={{color:"#DABFDE"}}>Register</h2>

//       {/* User Type Selection */}
//       <div className="d-flex justify-content-center">
//         <div className="btn-group">
//         <button
//   className={`btn ${userType === "student" ? "btn-black" : "btn-outline-black"}`}
//   style={{ backgroundColor: userType === "student" ? "#DABFDE" : "transparent", color: "black" }}
//   onClick={() => setUserType("student")}
// >
//   Register as Student
// </button>
//           <button
//               className={`btn ${userType === "admin" ? "btn-black" : "btn-outline-black"}`}
//                 style={{backgroundColor: userType === "admin" ? "#DABFDE" : "transparent", color: "black" }}
//             onClick={() => setUserType("admin")}
//           >
//             Register as Admin
//           </button>
//         </div>
//       </div>

//       {/* Registration Form */}
//       <form className="register-form" onSubmit={handleSubmit}>
//         {userType === "admin" && (
//           <div className="mb-3">
//             <label className="form-label">Event</label>
//             <input type="text" className="form-control" name="event" value={formData.event} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
//           </div>
//         )}

//         <div className="mb-3">
//           <label className="form-label">Name</label>
//           <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
//         </div>

//         {userType === "student" && (
//           <div className="mb-3">
//             <label className="form-label">College ID</label>
//             <input type="text" className="form-control" name="collegeId" value={formData.collegeId} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
//           </div>
//         )}

//         <div className="mb-3">
//           <label className="form-label">Email</label>
//           <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Password</label>
//           <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }}  required />
//         </div>

//         <button type="submit" className="btn w-100" style={{borderColor:"black",backgroundColor:"#DABFDE",color:"white"}}>Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";

function Register() {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    collegeId: "",
    email: "",
    password: "",
    event: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const finalFormData = {
      name: formData.name,
      collegeId: formData.collegeId,
      email: formData.email,
      password: formData.password,
      role: userType, // Assign role dynamically
      event: userType === "admin" ? formData.event : "", // Only for admins
    };
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Registration successful!");
        console.log("Success:", data);
      } else {
        alert(`Error: ${data.error || "Registration failed"}`);
        console.error("Error:", data);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Request error:", error);
    }
  };
  

  return (
    <div className="container register-container">
      <h2 className="text-center" style={{ color: "#DABFDE" }}>Register</h2>

      {/* User Type Selection */}
      <div className="d-flex justify-content-center">
        <div className="btn-group">
          <button
            className={`btn ${userType === "student" ? "btn-black" : "btn-outline-black"}`}
            style={{ backgroundColor: userType === "student" ? "#DABFDE" : "transparent", color: "black" }}
            onClick={() => setUserType("student")}
          >
            Register as Student
          </button>
          <button
            className={`btn ${userType === "admin" ? "btn-black" : "btn-outline-black"}`}
            style={{ backgroundColor: userType === "admin" ? "#DABFDE" : "transparent", color: "black" }}
            onClick={() => setUserType("admin")}
          >
            Register as Admin
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <form className="register-form" onSubmit={handleSubmit}>
        {userType === "admin" && (
          <div className="mb-3">
            <label className="form-label">Event</label>
            <input type="text" className="form-control" name="event" value={formData.event} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
        </div>

        {userType === "student" && (
          <div className="mb-3">
            <label className="form-label">College ID</label>
            <input type="text" className="form-control" name="collegeId" value={formData.collegeId} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} style={{ borderColor: "black", outlineColor: "black" }} required />
        </div>

        <button type="submit" className="btn w-100" style={{ borderColor: "black", backgroundColor: "#DABFDE", color: "white" }}>Register</button>
      </form>
    </div>
  );
}

export default Register;

