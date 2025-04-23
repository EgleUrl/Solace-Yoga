// Define the routing structure of the application using React Router
// This file sets up the main application structure, including the Navbar and Footer components.
// It also defines the routes for different pages in the application.
// It also includes protected route for certain checkout page.
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import About from './pages/about';
import Announcements from './pages/announcements';
import Checkout from './pages/checkout';
import Classes from './pages/classes';
import Contact from './pages/contact';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Success from './pages/success';
import Teachers from './pages/teachers';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />        
        <Route path="/success" element={<Success />} />        
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
