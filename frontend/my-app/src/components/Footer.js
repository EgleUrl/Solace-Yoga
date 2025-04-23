// Footer component 
import { Container, Row, Col } from 'react-bootstrap';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import './Footer.css'
import smallLogo from  '../assets/logosmall.png?url' ;

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-white)', padding: '20px 0' }}>
      <Container>
        <Row className="align-items-center" >
          <Col sm={12} md={4} className="text-center text-md-start mb-3 mb-md-0">
          <img
                      src={smallLogo}
                      alt="Solace Yoga Logo"
                      style={{ height: '5vh', marginRight: '10px' }}/>
            <h5 style= {{color: 'var(--color-white)'}}>Solace Yoga</h5>
            <p style={{ margin: 0, color: 'var(--color-white)'}}>Rebalance your body and mind!</p>
          </Col>
            {/* Site links */}
          <Col sm={12} md={4} className="text-center mb-3 mb-md-0">
            <p style={{ marginBottom: '5px', color: 'var(--color-white)' }}>Quick Links:</p>
            <div className="quick-links">
                <a href="/" className="footer-link">Home</a>
                <a href="/about" className="footer-link">About</a>
                <a href="/classes" className="footer-link">Classes</a>
                <a href="/teachers" className="footer-link">Teachers</a>
                <a href="/announcements" className="footer-link">Announcements</a>
                <a href="/contact" className="footer-link">Contact</a>
                <a href="/login" className="footer-link">Login</a>
            </div>
          </Col>

            <Col sm={12} md={4} className="text-center text-md-end">
                <p style={{ marginBottom: '5px', marginRight: '30px', fontFamily: 'var(--font-heading)', color: 'var(--color-white)' }}>Follow Us:</p>

                {/* Social media links */}
                <a href="#" className="social-icon">
                    <FaInstagram style={{ marginRight: '5px', fontSize: '4vh' }} />
                </a>
                <a href="#" className="social-icon">
                    <FaFacebook style={{ marginRight: '5px', fontSize: '4vh' }} />
                </a>
                <a href="#" className="social-icon">
                    <FaYoutube style={{ marginRight: '5px', fontSize: '4vh' }} />
                </a>
            </Col>
        </Row>

        <Row className="pt-3">
          <Col className="text-center" style={{ fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} Solace Yoga. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer