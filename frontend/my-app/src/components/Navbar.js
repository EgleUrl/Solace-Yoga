// This is a React component for a navigation bar using React Router and Bootstrap.
import { NavLink } from 'react-router-dom';
import logo from  '../assets/logo.png' ;
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { FiShoppingBag } from 'react-icons/fi';


import "./Navbar.css"; // CSS file for custom styles

function NavigationBar() {
  // Function to handle active class
  const getNavLinkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  const { user, logout } = useAuth();  
  const navigate = useNavigate();


  return (
    <Navbar style={{ backgroundColor: '#FEF7EB' }} expand="lg">
      <Container>
        {/* Logo on the left */}
        <NavLink to="/" className="navbar-brand">
          <img
            src={logo}
            alt="Solace Yoga Logo"
            style={{ height: '10vh', marginRight: '10px' }}
          />
        </NavLink>

        {/* Mobile toggler */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Links on the right */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          <NavLink to="/" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>Home</b>
            </NavLink>
            <NavLink to="/about" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>About</b>
            </NavLink>
            <NavLink to="/classes" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>Classes</b>
            </NavLink>
            <NavLink to="/teachers" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>Teachers</b>
            </NavLink>            
            <NavLink to="/announcements" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>Announcements</b>
            </NavLink>                       
            <NavLink to="/contact" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>Contact</b>
            </NavLink>                        
            {!user ? (
            <NavLink to="/login" className={getNavLinkClass} style={{ color: 'var(--color-secondary)' }}>
              <b>Login</b>
            </NavLink>
            ) : (
            <NavLink
              to="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent actual navigation
                logout(navigate);   // Call your logout function
              }}
              className={getNavLinkClass}
              style={{ color: 'var(--color-secondary)' }}              
              > 
              <b>Logout</b>
            </NavLink>
            )}
            {user && (
            <NavLink
              to="/checkout"
              className={getNavLinkClass}
              style={{ color: 'var(--color-secondary)', alignItems: 'center' }}
            >
              <FiShoppingBag style={{ marginRight: '5px' }} />
              <b>Basket</b>
            </NavLink>
            )}            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
