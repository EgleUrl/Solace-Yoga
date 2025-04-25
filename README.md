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

#### Dynamic Announcements page
For regular website user (not looged in) shows just announcements
![image](https://github.com/user-attachments/assets/77343d14-f3c3-4cfa-b93a-53a895bbfce2)

For Client it shows upcomming classes and announcements
![image](https://github.com/user-attachments/assets/dbc1e368-2294-41a7-90a7-db993fa95aac)

For Teacher user it shows upcoming their classes with the number of students who booked that class, 
also teachers can create, edit or delete their own announcements
![image](https://github.com/user-attachments/assets/09c0c8a3-6f70-4775-ac31-81a84966da96)
![image](https://github.com/user-attachments/assets/fc894d43-d1f6-4666-a4f2-96a9f9fa2bd9)
![image](https://github.com/user-attachments/assets/a5812ee0-5abe-4dfd-a2be-c6050182085b)

Admins have full CRUD on all announcements
![image](https://github.com/user-attachments/assets/71b3b772-88f4-45a2-86cb-eaf790ed2126)
![image](https://github.com/user-attachments/assets/42c74c48-eecf-4940-9b13-0639d4b1fc31)

Admins have admin panel on localhost:8000/admin
They have full CRUD on users, teachers profiles, announcements, bookings, classes and their occurrences
![image](https://github.com/user-attachments/assets/279bd4af-d038-4eba-82a0-397244c3fa62)
Signal implementation on classes, when class is created and period is chosen (start and end dates),
signal is triggered and it creates class occurrences for that period automatically
Found at backend\studio\signal.py
![image](https://github.com/user-attachments/assets/f612dc7a-89e3-4f08-9b2e-149668ee6725)
![image](https://github.com/user-attachments/assets/d586fbc2-d53e-44a4-850a-4165da22dd1a)

Filtered new created class on Fridays

![image](https://github.com/user-attachments/assets/577aebe7-90bd-4cd6-a5f5-25c75ad612de)

Class booking is protected, users booking the class must be logged in, if they are not logged in, they are automatically redirected to login page

![image](https://github.com/user-attachments/assets/d0289cd0-655a-431c-8918-76a78f0d535a)

If login is successful they are redirected back to classes page

![image](https://github.com/user-attachments/assets/ad83841c-9195-4710-ace2-727a438bfb66)

If they do not have the account, they can create one by pressing Sing up

![image](https://github.com/user-attachments/assets/0adc20ed-e02b-4e11-9c74-64ecb614936e)

Basket page, Checkout page and Success page are protected pages, can be accessed only by logged in users

![image](https://github.com/user-attachments/assets/618dea06-87ba-4237-b2db-61dd86d421fa)

Two payment options

![image](https://github.com/user-attachments/assets/9ba75c35-46f9-4083-84d2-4998a8abdafd)

Stripe payment option

![image](https://github.com/user-attachments/assets/2e773f56-9ad2-4c89-9d0e-5ad6ee497f5a)

Paypal payment option

![image](https://github.com/user-attachments/assets/da5bd84c-48b1-4c87-b754-47323fbd1897)

Paypal is in sandbox mode details to test it must be correct, though no money will be taken from the real card.

Stripe is in test mode, for this to test 4242 4242 4242 4242 card must be used.

Dynamic navigation bar 

![image](https://github.com/user-attachments/assets/ef60c29e-744f-4503-bbd1-7277d08374d8)


![image](https://github.com/user-attachments/assets/9aed120a-4b98-4896-8f27-141246897723)

Dynamic Breadcrumbs section

![image](https://github.com/user-attachments/assets/4af41dc1-5aeb-4af5-8b16-84d9c88e6afc)


![image](https://github.com/user-attachments/assets/0e7bbe71-df70-4988-8e6c-765a0e8e25d9)

Login function with Google OAuth

![image](https://github.com/user-attachments/assets/e72c46e8-cab6-44c4-a3a1-e25cbd9afae0)



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

 ![image](https://github.com/user-attachments/assets/57767d02-78e3-482c-9f73-df020350421c)
 ![image](https://github.com/user-attachments/assets/05cfbc58-eb61-45fb-8c28-e4c7605e866b)


- AWS (EC2 instance)

 ![image](https://github.com/user-attachments/assets/553c3f74-0aab-42bf-8025-09fefff0529b)

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




