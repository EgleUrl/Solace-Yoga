// Register page accessible through Login page
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';
import Hero from '../components/Hero';
import PageHeader from '../components/PageHeader';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css'; // Reusing the same styling as login

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  // Updates the formData state with the new value of the input field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  // Validates the form data and sends a POST request to the server
  // If successful, store the access token and user data in local storage and redirect to the login page
  // If failed, display an error message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      alert('Registration successful! You can now log in.');
      navigate('/login');
      console.log(formData);
      console.log('Backend response:', response.data);

    } catch (error) {
      console.error(error);
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Validate email format using a regular expression
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };  

  // Handle Google login
  // Uses Post request to send the Google access token to the server
  // If successful, store the access token and user data in local storage and redirect to the next page
  // If failed, display an error message
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true); // Start loading
      try {
        const response = await api.post('google-login/', {
          access_token: tokenResponse.access_token,
        });
    
        login(response.data.access, response.data.user);
        toast.success('You have successfully registered with Google!');
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        toast.error('Google registration failed.');
      } finally {
        setGoogleLoading(false); // Stop loading
      }
    },
    
    onError: () => {
      toast.error('Google login failed');
    },
  });
  

  return (
    <div className="login-page">
      <PageHeader title="Register" curPage="Register" />
      <Hero title="Become a Member" text="Sign up to start your yoga journey with Solace Yoga" />
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Col md={8}>
            <h2 className="text-center mt-4 mb-0">Create Your Account</h2>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <div className="form-container">
              <Form onSubmit={handleSubmit} className="form-area">
                <div className="mt-4 me-4 mx-4 pb-4 auto">
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="role">
                    <Form.Label>Select Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="client">Client</option>
                      <option value="teacher">Teacher</option>
                    </Form.Select>
                  </Form.Group>
                  <Button id="button" type="submit" className="w-100" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                  </Button>
                  {/* Google OAuth button */}
                  <div className="text-center mt-3">
                    <Button
                      variant="light"
                      className="google-btn w-100"
                      onClick={() => googleLogin()}
                      disabled={googleLoading} // Disable while loading
                    >
                    {googleLoading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                      ) : (
                    <FcGoogle size={20} className="me-2" />
                    )}
                      Sign up with Google
                    </Button>
                  </div>
                  <div className="text-center mt-4">
                    <p>Already have an account?</p>
                    <Button id="button" href="/login" className="w-100 mb-4">
                      Log In
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Register;
