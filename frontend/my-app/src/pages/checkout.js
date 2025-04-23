// Checkout page for user basket display and management
// It allows users to view their selected classes, remove items, and proceed to payment
// It uses the BasketContext to manage the user's basket state
// It uses the AuthContext to manage the user's authentication state
// It uses the Stripe and PayPal APIs for payment processing
import React, { useState } from 'react';
import { useBasket } from '../context/BasketContext';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { FiTrash2, FiCreditCard } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { createBooking } from '../api/yogaApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Hero from '../components/Hero';

const stripePromise = loadStripe('pk_test_51Oyfo6P7tQOhIrsaVfoAJxVBwmZgg4RSe69UmfiTqHe0hOXKxlm3ye0YW9PGW35Gg1eahahWCSfg1h6qO6zpd0FZ00nmJSo8dZ');

function Checkout() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { basket, clearBasket, removeFromBasket } = useBasket();
  const pricePerClass = 15;
  const total = basket.length * pricePerClass;
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Function to handle Stripe payment
  const handleStripePayment = async () => {
    try {
      const stripe = await stripePromise;

      // Checks if the Stripe object is loaded, has flag 'stripe' and is not null
      localStorage.setItem('payment_method', 'stripe');

      const lineItems = [
        {
          price: 'price_1RDsl4P7tQOhIrsaTT1BeKDB', // Replace with your actual price ID
          // This price ID should be created in your Stripe dashboard
          quantity: basket.length,
        },
      ];

      const { error } = await stripe.redirectToCheckout({
        lineItems,
        mode: 'payment',
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/checkout',
      });

      if (error) {
        console.error(error);
        toast.error('Stripe checkout failed. Try again.');
      }

    } catch (err) {
      console.error('Stripe payment error:', err);
      toast.error('Stripe payment failed.');
    }
  };

  // Function to handle PayPal payment
  // Uses PayPal's JavaScript SDK to create an order and capture it
  // If successful, it creates a booking using the createBooking function
  // If the user is not logged in, it shows an error message
  const handlePayPalApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      localStorage.setItem('payment_method', 'paypal');

      if (!accessToken) {
        toast.error('You must be logged in to complete your booking.');
        return;
      }

      const response = await createBooking(basket, accessToken);

      const confirmed = basket.map((item) => ({
        title: item.title,
        teacher: item.teacher.username,
        date: item.selectedOccurrence?.date,
      }));

      clearBasket();
      setTimeout(() => {
        navigate('/success', { state: { confirmed } });
      }, 100);

    } catch (error) {
      console.error('Booking creation failed after PayPal payment:', error);
      toast.error('Booking failed. Please contact support.');
    }
  };

  return (
    <div className="checkout-page">
      <div>
        <PageHeader title={'Basket'} curPage={'Checkout'} />
      </div>
      {/* Hero Section */}
      <Hero title={"Your basket"} text={"Your chosen classes, please choose the payment method to finish the booking process."} />
    <Container className="mt-5 mb-4">
      <h2 className="text-center mb-4">Your Booking Basket</h2>

      {basket.length === 0 ? (
        <p><strong>Your basket is empty.</strong></p>
      ) : (
        <>
          <ListGroup className="mb-4">
            {basket.map((item, index) => (
              <ListGroup.Item key={index} className="mb-3 p-3 shadow-lg">
                <Row className="align-items-center">
                  <Col xs={12} md={4} style= {{ color: 'var(--color-text)' }}>
                    <h5 className="mb-1">{item.title}</h5>
                    <small >{item.location}</small>
                  </Col>
                  <Col xs={6} md={2} className="text-md-center" style= {{ color: 'var(--color-text)' }}>
                    <div><strong>Date:</strong></div>
                    <div>{item.selectedOccurrence?.date || 'No date selected'}</div>
                  </Col>
                  <Col xs={6} md={2} className="text-md-center" style= {{ color: 'var(--color-text)' }}>
                    <div><strong>Time:</strong></div>
                    <div>{item.time}</div>
                  </Col>
                  <Col xs={6} md={2} className="text-md-center" style= {{ color: 'var(--color-text)' }}>
                    <div><strong>Teacher:</strong></div>
                    <div>{item.teacher.username}</div>
                  </Col>
                  <Col xs={4} md={1} className="text-md-center" style= {{ color: 'var(--color-text)' }}>
                    <div><strong>Price:</strong></div>
                    <div>£{pricePerClass}</div>
                  </Col>
                  <Col xs={2} md={1} className="text-md-center">
                    <FiTrash2
                      onClick={() => removeFromBasket(index)}
                      style={{ color: 'var(--color-secondary)', cursor: 'pointer', fontSize: '2rem' }}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="d-flex justify-content-end m-2 align-items-center">
            <h4 className="me-2 mb-0">Total: £{total}</h4>
            <Button
              id="button2"
              className="me-2"
              disabled={basket.length === 0 || showPaymentOptions}
              onClick={() => setShowPaymentOptions(true)}
            >
              <FiCreditCard className="me-1" />
              Pay Now
            </Button>
            <Button id="button" onClick={clearBasket}>Clear Basket</Button>
          </div>

          {showPaymentOptions && (
            <div className="mt-4">
              <h4 className="mb-4 mt-4">Choose Payment Method:</h4>
              <div className="d-flex flex-column align-items-center gap-2">
                <Button id="button" className="w-50" onClick={handleStripePayment}>
                  Pay with Card
                </Button>

                <div className="w-50">
                  <PayPalButtons
                    style={{ layout: 'horizontal' }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: total.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={handlePayPalApprove}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
    </div>
  );
}

export default Checkout;




