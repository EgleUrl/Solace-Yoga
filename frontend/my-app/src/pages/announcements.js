// Announcement page for teachers and admins allows CRUD operations on announcements
// It uses the AuthContext to manage the user's authentication state
// It uses the YogaApi to fetch and manipulate announcements
// For clients it shows upcoming classes
// For teachers it shows next classes
// For all users it shows a list of announcements and allows filtering by class
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ClientUpcomingClasses from '../components/announcements/ClientUpcomingClasses';
import TeacherNextClasses from '../components/announcements/TeacherNextClasses';
import PageHeader from '../components/PageHeader';
import Hero from '../components/Hero';
import { toast } from 'react-toastify';
import {
  fetchAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  fetchClasses,
} from '../api/yogaApi';

function Announcements() {
  const { user, accessToken } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [yogaClasses, setYogaClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filterClass, setFilterClass] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: true,
    yoga_class: '',
  });

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  // Load announcements and yoga classes when the component mounts
  // This is done using the useEffect hook
  // The loadAnnouncements and loadYogaClasses functions are called to fetch data from the API
  // The data is then stored in the state variables using the setAnnouncements and setYogaClasses functions
  useEffect(() => {
    loadAnnouncements();
    loadYogaClasses();
  }, []);

  // Fetch announcements and yoga classes from the API
  const loadAnnouncements = async () => {
    try {
      const data = await fetchAnnouncements();      
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    }
  };

  // Fetch yoga classes from the API
  // This is used to populate the dropdown for selecting a yoga class when creating or editing an announcement
  // The data is then stored in the state variable using the setYogaClasses function
  const loadYogaClasses = async () => {
    try {
      const classes = await fetchClasses();
      setYogaClasses(classes); 
    } catch (error) {
      console.error('Failed to fetch yoga classes', error);
    }
  };

  // Handle input changes for the form fields
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle changes for the yoga class dropdown
  // If "none" is selected, set yoga_class to null
  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      yoga_class: e.target.value === 'none' ? null : e.target.value,
    }));
  };

  // Handle form submission for creating or updating an announcement
  // If editingId is set, it means we are updating an existing announcement
  // Otherwise, we are creating a new one
  // The formData is sent to the API using the createAnnouncement or updateAnnouncement function
  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData, accessToken);
        toast.success('Announcement updated!');
      } else {
        await createAnnouncement(formData, accessToken);
        toast.success('Announcement created!');
      }
      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save announcement');
    }
  };

  // Handle deletion of an announcement
  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id, accessToken);
      toast.success('Deleted');
      loadAnnouncements();
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  // Handle editing of an announcement
  // When the edit button is clicked, set the editingId and populate the formData with the announcement details
  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      published: announcement.published,
      yoga_class: announcement.yoga_class || '',
    });
  };

  // Reset the form to its initial state
  // This is used when the user clicks the cancel button or after creating/updating an announcement
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      published: true,
      yoga_class: '',
    });
  };

  // Check if the user can edit or delete an announcement
  // Admins can always edit/delete
  // Teachers can only edit/delete their own announcements
  // Clients cannot edit/delete any announcements
  const canEditOrDelete = (announcement) => {
    if (isAdmin) return true;
    if (isTeacher && announcement.created_by_username === user.username) return true;
    return false;
  };

  const canCreate = isAdmin || isTeacher;

  // Filtering logic
  const filteredAnnouncements = announcements.filter((a) => {
    if (filterClass === '') return true;
    if (filterClass === 'general') return !a.yoga_class_title;
    return a.yoga_class_title === filterClass;
  });

  // Pagination logic
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="about-page">
        <div>
            <PageHeader title={'Announcements'} curPage={'Announcements'} />
        </div>
      {/* Hero Section */}
      <Hero title={"Membership zone"} text={"Recent announcements, login to find out your upcoming classes."} />
    <Container className="mt-5">
      <h2 className="text-center mb-4">Announcements</h2>
      <ClientUpcomingClasses />
      <TeacherNextClasses />
      {/* Filter Dropdown */}
      <Col md={6} className="mx-auto mb-4">
      <Form.Select 
        style={{ color: 'var(--color-text)', fontWeight:"bold" }} 
        value={filterClass}
        onChange={(e) => {
          setFilterClass(e.target.value);
          setPage(1);
        }}
        className="mb-4"
      >
        <option value="">All Announcements</option>
        <option value="general">General Only</option>
        {yogaClasses.map((yc) => (
          <option key={yc.id} value={yc.title}>
            {yc.title}
          </option>
        ))}
      </Form.Select>
      </Col>
      {/* Create/Edit Form for authenticated admin and teacher users only*/}
      {canCreate && (
        <Card className="mb-4 p-3 shadow-lg">
          <h5 style= {{ color: 'var(--color-primary)'}}>{editingId ? 'Edit Announcement' : 'Create New Announcement'}</h5>
          <Form.Group className="mx -auto mb-2">
            <Form.Label style= {{ color: 'var(--color-text)'}}>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label style= {{ color: 'var(--color-text)'}}>Content</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={3}
              value={formData.content}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label style= {{ color: 'var(--color-text)'}}>Yoga Class (optional)</Form.Label>
            <Form.Select style= {{ color: 'var(--color-text)'}} value={formData.yoga_class || 'none'} onChange={handleSelectChange}>
              <option value="none">— No Class —</option>
              {yogaClasses.map((yc) => (
                <option key={yc.id} value={yc.id}>
                  {yc.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Check
            style= {{ color: 'var(--color-text)'}}
            className="custom-checkbox"
            type="checkbox"
            label="Published"
            name="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                published: e.target.checked,
              }))
            }
          />
          <div className="d-flex gap-2 mt-3">
            <Button id="button" onClick={handleCreateOrUpdate}>
              {editingId ? 'Update' : 'Post'} Announcement
            </Button>
            {editingId && (
              <Button id="button2" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Announcement List */}
      <Row>
        {paginatedAnnouncements.length === 0 && (
          <p className="text-center mb-4"><strong>No announcements found for this filter.</strong></p>
        )}
        {paginatedAnnouncements.map((a) => (
          <Col md={6} key={a.id} className="mb-4">
            <Card className=" cardh h-100 shadow-lg">
              <Card.Body>
                <Card.Title style={{ color: 'var(--color-primary)'}}>{a.title}</Card.Title>
                <Card.Text>{a.content}</Card.Text>
                <div className="mb-2">
                  {a.yoga_class_title ? (
                    <span className="badge" style={{ backgroundColor: 'var(--color-secondary)'}}>Class: {a.yoga_class_title}</span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: 'var(--color-primary)'}}>General</span>
                  )}
                </div>
                <small style={{ color: 'var(--color-text)' }}>
                  {new Date(a.created_at).toLocaleString()}
                </small>
              </Card.Body>
              {canEditOrDelete(a) && (
                <Card.Footer className="d-flex justify-content-end gap-2">
                  <Button
                    id="button2"
                    size="sm"
                    onClick={() => handleEdit(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    id="button"
                    size="sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      {filteredAnnouncements.length > itemsPerPage && (
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            id="button2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            id="button2"
            disabled={page * itemsPerPage >= filteredAnnouncements.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
    </div>
  );
}
export default Announcements;




