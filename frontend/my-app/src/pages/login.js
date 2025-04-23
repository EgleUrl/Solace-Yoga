// Login page with login form and Google login
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // adjust path if needed
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import Hero from '../components/Hero';
import PageHeader from '../components/PageHeader';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get('next') || '/announcements'; // Default to '/announcements' if 'next' is not provided
  const [googleLoading, setGoogleLoading] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);  

  // Handle login form submission
  // Uses Post request to send username/email and password to the server
  // If successful, store the access token and user data in local storage and redirect to the next page
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');    

    try {
      const response = await api.post('token/', {
        username: usernameOrEmail,
        password,
      });

      login(response.data.access, response.data.user);
      navigate(next);

    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid username/email or password.');
      toast.error('Invalid username or password');    
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Google login
  // Uses Post request to send the Google access token to the server
  // If successful, store the access token and user data in local storage and redirect to the next page
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true); // Start loading
      try {
        const response = await api.post('google-login/', {
          access_token: tokenResponse.access_token,
        });
  
        login(response.data.access, response.data.user);
        toast.success('You have successfully logged in with Google!');
        navigate(next);
      } catch (error) {
        console.error(error);
        toast.error('Google login failed on server.');
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
         <div>
            <PageHeader title={'Login'} curPage={'Login'} />
        </div>
        {/* Hero Section */}
        <Hero title={"Solace Yoga members area"} text={"Login or sign up to become our member"} />
        <Container >       
          <Row className="justify-content-md-center mt-4 mb-4">
            <Col md={8}>
              <h2 className="text-center mt-4 mb-0">Sign In to Solace Yoga</h2>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <div className='form-container '>
                <Form onSubmit={handleLogin} className='form-area '>
                  <div className='mt-4 me-4 mx-4 pb-4 auto'>
                    <Form.Group className="mb-3" controlId="usernameOrEmail">
                      <Form.Label>Username or Email</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username or email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                    </Form.Group>
                    <Button id='button' type="submit" className="w-100" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                    </Button>
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
                        Sign in with Google
                      </Button>
                      <div className="text-center mt-4">
                        <p>Don’t have an account?</p>
                        <Button id="button" href="/register" className="w-100 mb-4">  Sign Up  </Button>
                      </div>
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
export default Login;
