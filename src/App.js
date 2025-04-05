// import {BrowserRouter,Routes,Route} from "react-router-dom";
// import Layout from "./pages/Layout";
// import Home from "./pages/Home";
// import Blogs from "./pages/Blogs";
// import Contact from "./pages/Contact";
// import NoPage from "./pages/Nopage";
// import Register from "./pages/register";
// import Login from "./pages/Login";
// import NSS from "./pages/NSS"; 
// import HHO from "./pages/HHO"; 
// import Ornate from "./pages/Ornate";
// import PrivateRoute from "./pages/PrivateRoute"; 

// function App() {
//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Layout />}>
//          <Route index element={<Home />}/>
//          <Route path="blogs" element={<Blogs />}/>
//          <Route path="contact" element={<Contact />}/>
//          <Route path="*" element={<NoPage />}/>
//          <Route path="register" element={<Register />}/>
//          <Route path="Login" element={<Login />}/>

//          <Route path="NSS" element={<PrivateRoute><NSS /></PrivateRoute>} />
//           <Route path="HHO" element={<PrivateRoute><HHO /></PrivateRoute>} />
//           <Route path="Ornate" element={<PrivateRoute><Ornate /></PrivateRoute>} />
         
//       </Route>
//     </Routes>
//     </BrowserRouter>
//   )
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";

import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/Nopage";


import NSS from "./pages/NSS";
import HHO from "./pages/HHO";
import Ornate from "./pages/Ornate";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./pages/PrivateRoute";
import { AuthProvider } from "./context/AuthContext"; // Context for authentication
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider> 
     
      
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NoPage />} />

            {/* Private Routes (Only for authenticated users) */}
            <Route path="student-dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
            
             {/* Admin Dashboard (Only for authenticated admins) */}
             <Route path="admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          </Route>

            {/* Event Pages (Only for authenticated students) */}
            <Route path="NSS" element={<PrivateRoute><NSS /></PrivateRoute>} />
            <Route path="HHO" element={<PrivateRoute><HHO /></PrivateRoute>} />
            <Route path="Ornate" element={<PrivateRoute><Ornate /></PrivateRoute>} />

           
        </Routes>
        </AuthProvider>
      </BrowserRouter>
     
  
  );
}

export default App;

