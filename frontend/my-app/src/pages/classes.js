// Classes page display all classes
// It allows users to filter classes by teacher, day of the week, time of day and location
// It allows users to select a class date and book it
// It uses the BasketContext to manage the user's basket state
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Form, Button } from 'react-bootstrap';
import { fetchClasses, fetchTeachers, fetchOccurrences } from '../api/yogaApi';
import { useBasket } from '../context/BasketContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from '../components/PageHeader';
import Hero from '../components/Hero';
import './Classes.css'; 

function Classes() {
  const { user } = useAuth();
  const { addToBasket } = useBasket();
  const navigate = useNavigate();
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [occurrences, setOccurrences] = useState({});
  const [selectedOccurrences, setSelectedOccurrences] = useState({});
  const [filtersInitialized, setFiltersInitialized] = useState(false);

// Defines filters
  const initialFilters = {
    teacher: '',
    day_of_week: '',
    location: '',
    timeOfDay: '',
  };

  const [filters, setFilters] = useState(initialFilters);

  // Fetch teachers & classes on mount 
    useEffect(() => {
      const fetchInitialTeachers = async () => {
        try {
          const teachersData = await fetchTeachers();
          setTeachers(teachersData);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      };
      fetchInitialTeachers();
    }, []);

  // Refetch classes when URL search params change
  // This effect runs only once when the component mounts
  // It initializes the filters based on the URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const teacher = searchParams.get('teacher') || '';
    const dayOfWeek = searchParams.get('day_of_week') || '';
    const locationParam = searchParams.get('location') || '';
    const timeOfDay = searchParams.get('timeOfDay') || '';
  
    setFilters({
      teacher,
      day_of_week: dayOfWeek,
      location: locationParam,
      timeOfDay,
    });
  
    setFiltersInitialized(true); 
  }, [location.search]);
  

  // Refetch classes when filters change
  useEffect(() => {
    if (filtersInitialized) {
      getClasses(filters);
    }
  }, [filters, filtersInitialized]);
  
  

  // Fetch classes and their occurrences
  const getClasses = async (currentFilters) => {
    setLoading(true);
    try {
      const params = {};
      if (currentFilters.teacher) params['teacher__user__username'] = currentFilters.teacher;
      if (currentFilters.day_of_week) params['day_of_week'] = currentFilters.day_of_week;
      if (currentFilters.location) params['location'] = currentFilters.location;

      const data = await fetchClasses(params);

      // Time of day filter, defines morning, afternoon and evening
      // Morning: 5:00 - 11:59
      // Afternoon: 12:00 - 17:59
      // Evening: 18:00 - 23:59
      // Filter classes based on time of day
      let filteredData = data;
      if (currentFilters.timeOfDay) {
        filteredData = data.filter((cls) => {
          const [hours, minutes] = cls.time.split(':').map(Number);
          const totalMinutes = hours * 60 + minutes;
          if (currentFilters.timeOfDay === 'morning') return totalMinutes >= 300 && totalMinutes < 720;
          if (currentFilters.timeOfDay === 'afternoon') return totalMinutes >= 720 && totalMinutes < 1080;
          if (currentFilters.timeOfDay === 'evening') return totalMinutes >= 1080 && totalMinutes < 1320;
          return true;
        });
      }

      setClasses(filteredData);

      // Fetch occurrences for each class
      // checks if the occurrence is not canceled or full
      // and preselects the first available occurrence
      const occurrencesMap = {};
      await Promise.all(
        filteredData.map(async (cls) => {
          const classOccurrences = await fetchOccurrences(cls.id);
          occurrencesMap[cls.id] = classOccurrences;
          // Preselect first available occurrence
          if (classOccurrences.length > 0) {
            const available = classOccurrences.find(
              (occ) => !occ.is_canceled && occ.booked_count < occ.capacity
            );
            if (available) {
              setSelectedOccurrences((prev) => ({
                ...prev,
                [cls.id]: available.id,
              }));
            }
          }          
        })
      );

      setOccurrences(occurrencesMap);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  // Updates the filters state and URL search parameters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const searchParams = new URLSearchParams();
    if (updatedFilters.teacher) searchParams.set('teacher', updatedFilters.teacher);
    if (updatedFilters.day_of_week) searchParams.set('day_of_week', updatedFilters.day_of_week);
    if (updatedFilters.location) searchParams.set('location', updatedFilters.location);
    if (updatedFilters.timeOfDay) searchParams.set('timeOfDay', updatedFilters.timeOfDay);

    navigate({ search: searchParams.toString() }, { replace: true }); // update URL without reload
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters(initialFilters);
    navigate('/classes', { replace: true });
  };

  //  Handle booking
  // Checks if the user is logged in
  // If not, redirects to the login page
  // If the user is logged in, adds the class to the basket and redirects to the checkout page
  // If the user is not logged in, after login, redirects to the classes page
  const handleBookClass = (classItem) => {
    const selectedOccurrenceId = selectedOccurrences[classItem.id];
    const classOccurrences = occurrences[classItem.id] || [];
    const selectedOccurrence = classOccurrences.find((occ) => occ.id === selectedOccurrenceId);

    if (!selectedOccurrence) {
      toast.error('Please select a class date.');
      return;
    }

    if (!user) {
      navigate(`/login?next=/classes`);
      return;    
    } else {
      const classWithOccurrence = { ...classItem, selectedOccurrence };
      addToBasket(classWithOccurrence);
      toast.success(`Class on ${selectedOccurrence.date} added to basket!`);
      navigate('/checkout');
    }
  };

  const uniqueLocations = [...new Set(classes.map((cls) => cls.location))]; 

  return (
    <div className="classes-page">
      <div>
        <PageHeader title={'Classes'} curPage={'Classes'} />
      </div>
      {/* Hero Section */}
      <Hero title={"Solace Yoga classes"} text={"Choose your prefered classes"} />
      <Container className="mt-5">
        <h2 className="text-center mb-4">Explore Our Classes</h2>

        {/* Filters */}
        <Form className="mb-4">
          <Row>
            <Col md={2} className="mb-2">
              <Form.Select name="teacher" value={filters.teacher} onChange={handleFilterChange} style={{ color: 'var(--color-text)', fontWeight: 'bold'}}>
                <option value="">All Teachers</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.username}>
                    {teacher.username}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2} className="mb-2">
              <Form.Select name="day_of_week" value={filters.day_of_week} onChange={handleFilterChange} style={{ color: 'var(--color-text)', fontWeight: 'bold'}}>
                <option value="">All Weekdays</option>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2} className="mb-2">
              <Form.Select name="timeOfDay" value={filters.timeOfDay} onChange={handleFilterChange} style={{ color: 'var(--color-text)', fontWeight: 'bold'}}>
                <option value="">All Times</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </Form.Select>
            </Col>

            <Col md={2} className="mb-2">
              <Form.Select name="location" value={filters.location} onChange={handleFilterChange} style={{ color: 'var(--color-text)', fontWeight: 'bold'}}>
                <option value="">All Locations</option>
                {uniqueLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2} className="mb-2 d-grid">
              <Button id="button" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Classes Display */}
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center mt-5 font-weight-bold">            
            <p>No classes found. Try different filters!</p>
          </div>
        ) : (
          <Row className='mb-4'>
            {classes.map((cls) => {
              const classOccurrences = occurrences[cls.id] || [];
              const selectedOccurrenceId = selectedOccurrences[cls.id];
              const availableOccurrences = classOccurrences.filter(
                (occ) => !occ.is_canceled && occ.booked_count < occ.capacity
              );
              const isDisabled = availableOccurrences.length === 0;
            

              return (
                <Col key={cls.id} md={4} className="mb-4">
                  <Card className="cardc h-100 shadow mb-2">
                    <Card.Body>
                      <Card.Title style={{ color: 'var(--color-primary)', fontWeight: 'bold'}}>{cls.title}</Card.Title>
                      <Card.Subtitle className="mb-2" style={{ color: 'var(--color-secondary)'}}>{cls.location}</Card.Subtitle>
                      <Card.Text>
                        <strong>Teacher:</strong> {cls.teacher.username} <br />
                        <strong>Weeday:</strong> {cls.day_of_week} <br />
                        <strong>Time:</strong> {cls.time} <br />
                        <p style={{ color: 'var(--color-primary)', fontWeight: 'bold'}}>{cls.description}</p>
                      </Card.Text>

                      {/* Occurrence selector */}
                      {availableOccurrences.length > 0 ? (
                      <Form.Select
                        className="mb-3"
                        style={{ color: 'var(--color-text)', fontWeight: 'bold'}}
                        value={selectedOccurrenceId}
                        onChange={(e) =>
                          setSelectedOccurrences((prev) => ({
                            ...prev,
                            [cls.id]: parseInt(e.target.value, 10),
                          }))
                        }
                      >
                      {availableOccurrences.map((occ) => {
                        const spotsLeft = occ.capacity - occ.booked_count;
                        return (
                          <option key={occ.id} value={occ.id}>
                            {occ.date} — {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                            {spotsLeft === 1 ? ' ⚠️ Only 1 spot left!' : ''}
                          </option>
                        );
                      })}
                      </Form.Select>
                        ) : (
                        <div className="text-danger mb-3">All classes are full.</div>
                      )}
                      {/* Book Class Button */}
                      <Button
                        id="button"
                        disabled={isDisabled}
                        onClick={() => handleBookClass(cls)}
                      >
                        {isDisabled ? 'No Available Dates' : 'Book Class'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Classes;



