
// Success page for the booking process
// This page is displayed after a successful payment
// It finalizes the booking process and provides feedback to the user
// It uses the BasketContext to manage the user's basket state
// It uses the AuthContext to manage the user's authentication state
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../api/yogaApi';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import Hero from '../components/Hero';

function Success() {
  const { basket, clearBasket } = useBasket();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(true);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [bookingAttempted, setBookingAttempted] = useState(false);

  useEffect(() => {
    const finalizeBooking = async () => {
      const paymentMethod = localStorage.getItem('payment_method');

      // Only run booking logic for Stripe
      // PayPal bookings are handled in the PayPal button component at checkout page
      // Also checks if the payment method was not made before and confirmed by stripe
      if (paymentMethod === 'stripe') {
        setBookingAttempted(true);

        try {
          const filteredBasket = basket.filter(
            (item) => item.selectedOccurrence?.id
          );

          if (filteredBasket.length > 0) {
            const response = await createBooking(filteredBasket, accessToken);

            setBookingSummary({
              created: response.created_bookings || [],
              skipped: response.skipped_duplicates || [],
            });

            if (response.created_bookings?.length > 0) {
              toast.success('Booking confirmed!');
            }

            if (response.skipped_duplicates?.length > 0) {
              toast.warn('Some classes were already booked and were skipped.');
            }

          } else {
            toast.warn('No valid classes were found to book.');
          }
        } catch (error) {
          console.error('Error creating booking after payment:', error);
          toast.error('Could not finalize your booking.');
        }
      }

      clearBasket();
      localStorage.removeItem('payment_method');
      setProcessing(false);
    };

    finalizeBooking();
  }, []);

  return (
    <div className="classes-page">
      <div>
        <PageHeader title={'Confirmation'} curPage={'Success'} />
      </div>
      {/* Hero Section */}
      <Hero title={"Your booking"} text={"Information about your booking process."} />
      <div className="container mt-5 text-center">
        <h1 className='mb-4'>🎉 Payment Successful!</h1>
        {processing ? (
          <p>Finalizing your booking, please wait...</p>
        ) : !bookingAttempted ? (
          <p><strong>Your booking was completed via PayPal. You’re all set!</strong></p>
        ) : bookingSummary?.created?.length > 0 ? (
          <p><strong>Your booking has been confirmed. Check your email for details.</strong></p>
        ) : (
          <p><strong>You already booked these classes earlier. No new bookings were made.</strong></p>
        )}

        <button id="button" className="btn mt-4 mb-4" onClick={() => navigate('/announcements')}>
          Go to Announcements
        </button>
      </div>
    </div>
  );
}

export default Success;

