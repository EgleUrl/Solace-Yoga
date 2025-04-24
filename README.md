#  Solace Yoga Website

Welcome to **Solace Yoga**, a full-stack web application built to manage yoga studio operations. The system provides seamless account management, class booking, payment handling, and communication between clients, teachers, and administrators.

 ![image](https://github.com/user-attachments/assets/d79fe1eb-6aab-4bad-b670-4e264182b942)

## Content:
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Design solutions](#design-solutions)
5. [Getting Started](#getting-started)
6. [API documentation](#api-documentation)
7. [Testing](#testing)
8. [Future improvements](#future-improvements)
   
##  Features

###  User Roles
- **Admin**: Full access to manage users, classes, announcements.
- **Teacher**: Manage their own profile, classes, and announcements.
- **Client**: Register, book yoga classes, and receive updates.

###  Core Functionalities
- **User Authentication** (JWT with HttpOnly cookie refresh support)
- **Google OAuth Login**
- **Responsive UI** with  Bootstrap and React-Bootstrap
- **Role-Based Dashboards (Announcement page)**
- **Booking System** for yoga classes
- **Stripe and Paypal** payment processes
- **Teacher Profiles**
- **Announcements Page with CRUD options for admin or teachers**
- **Email Notifications and created announcements** on booking
- **Admin Panel** for user CRUD operations
- **Dockerized** deployment ready
- **CI/CD** support
- **AWS-ready**

##  Tech Stack

### Frontend
- React 
- Context API for Auth Management
- Bootstrap/React-Bootstrap
- Google OAuth via `@react-oauth/google`

### Backend
- Django + Django REST Framework
- PostgreSQL
- SimpleJWT for Authentication
- Role-based Permissions for CRUD 
- Custom Tokens for custom login (email or username)
- Django Filters
- Signal for automated Yoga classes occurrences creation

### Deployment
- Docker
- AWS (EC2 instance)
- GitHub Actions for CI/CD (deployment to AWS)

---
## Design solutions
### Moodboard

![image](https://github.com/user-attachments/assets/81ef9246-bb10-46f6-80f2-c64cdd371486)

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/EgleUrl/solace-yoga.git
cd backend
```
### 2. Open Docker Destkop and in VS Code
```bash
docker-compose up --build
```
### 3. Open Browser
```bash
http://locallhost:3000
```
### 4. Admin Panel
```bash
http://locallhost:8000/admin
```
### 5. Logins:
- Admin: admin labas17
- Teachers: teacher Name labas123
- Clients: client Name name1

## API documentation
### Base URL
```bash
http://locallhost:8000/api/
```
### POST /api/token/
Login with Username or Email and Password
```bash
Request:
{
  "username": "your_username_or_email",
  "password": "your_password"
}

Response:
{
  "access": "access_token",
  "user": {
    "username": "john",
    "email": "john@example.com",
    "role": "client"
  }
}
```
### POST /api/token/refresh/
Refresh Access Token using HttpOnly Cookie.

### POST /api/google-login/
```bash
Request:
{
  "access_token": "google_oauth_token"
}

Response:
{
  "access": "jwt_access_token",
  "user": {
    "username": "john",
    "email": "john@gmail.com",
    "role": "client"
  }
}
```
### GET /api/users/ (Admin only)
List all users

### POST /api/users/ (Admin only)
Create new user
```bash
{
  "username": "jane",
  "email": "jane@example.com",
  "password": "securepass123",
  "role": "client"
}
```
### PUT /api/users/{id}/
Update user by ID

### DELETE /api/users/{id}/
Delete user

### GET /api/classes/
List all yoga classes (filtered by teacher/date/location optional)

### POST /api/classes/ (Teacher only)
```bash
{
  "title": "Morning Flow",
  "description": "Energizing vinyasa class",
  "date_time": "2025-05-01T08:00:00Z",
  "duration": "01:00:00",
  "location": "Room A",
  "capacity": 15
}
```
### GET /api/bookings/
- Clients see their bookings.
- Teachers see bookings for their classes.

### POST /api/bookings/
Response triggers booking email confirmation.
```bash
{
  "yoga_class": 2
}
```
### GET /api/announcements/
- Clients see general and class-specific posts.
- Teachers see their own.
- Admins see all.

### POST /api/announcements/ (Teacher/Admin)
```bash
{
  "title": "Class Update",
  "content": "Class moved to Room B",
  "yoga_class": 2
}
```
### POST /api/register/
```bash
{
  "username": "emma",
  "email": "emma@example.com",
  "password": "password123",
  "role": "client"
}
```
## Testing
### Google Lighthouse

![image](https://github.com/user-attachments/assets/b2280cb0-a637-4806-bf66-e3ab88417b43)

* Indicates bad performance due to not production built app and too slow loading times 
* Contrast issues with text and background
* Optimised SEO
* And not the best practises due to depricated API dependancy, errors in console and detected JavaScrip libraries

### Pytest testing
- Integration test for the API endpoints
- Unit tests for the YogaClass model to check if teacher user can create a yoga class
- Integration test for booking duplicate prevention

  ![image](https://github.com/user-attachments/assets/69d85048-0a40-4d20-ae67-4be0bbcc197c)
  
  ```bash
  cd backend
  docker-compose exec web pytest

### React Jest testing
- Integration test of login page testing
- Unit tests for Home page components
- Login.test.js and Home.test.js

![image](https://github.com/user-attachments/assets/153d9934-3c6d-45e1-9851-72f18007bf81)

```bash
cd frontend
cd my-app
npm test
```
### CI/CD pipeline
- Runs in github actions everytime the git push is done
- After the successful push it deployes any changes to EC2 instance on AWS

  ![image](https://github.com/user-attachments/assets/72870131-611b-49cb-9300-999e8afd2692)


## Future improvements
- Make production ready app using gunicorn and NGNIX
- Integrate HTTPS to ensure security
- Improve design to make app more compatible with accessibility 




