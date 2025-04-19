# Hospital

# Management

# System

```
A Comprehensive System for Managing Patients, Doctors, and Appointments
```

- Hospital Management System (HMS) is an
    application designed to streamline
    healthcare management.
- Aims to manage patient records, doctor
    availability, and appointment scheduling.
- Enables users (patients and doctors) to
    interact with the system seamlessly.

##### Introduction


### System Overview

```
Purpose: Improve efficiency, reduce paperwork, and simplify appointment management.
Main Features:
```
- Patient Registration and Management
- Doctor Management
- Appointment Scheduling and Management
- Admin Panel for system-wide management

```
Technology Used: Django, HTML/CSS, JavaScript, Bootstrap, SQLite(Database)
```

### Key System Components

- Patient: Manages patient details, schedules appointments, views upcoming appointments, cancels or
    reschedules them.
- Doctor: Manages doctor profiles, availability, and consultations.
- Admin: Oversees the entire system, including managing users and appointments.
- Appointment: The core feature, where patients schedule and doctors approve/reject appointments.


- Home Page: Introduction to the hospital, services, and login options.
- Doctor Login: Doctors can manage their appointments, patient lists, and statuses.
- Patient Login: Patients can view and manage their appointments, including rescheduling or cancellation.
- Admin Dashboard: Admin can oversee patient and doctor
    profiles, manage appointments, and system settings.

##### Website Structure


#### User Roles

- Admin:
    Manage all users and appointments.
    Add/edit doctor or patient information.
    Approve/reject appointments.
- Doctor:
    View patient appointment requests.
       Confirm, reschedule, or reject appointments.
- Patient:
    Book appointments with doctors.
    Cancel or reschedule appointments.


- Login Page: Doctors log in using a username and
    password.
- Dashboard: View scheduled appointments, pending
    requests, and patient details.
- Option to confirm or reject appointments.
- Appointment Management:Doctors can set their
    availability.
- View and manage the list of patients scheduled for
    consultations.

##### Doctor Login System


#### Patient Login System

- Login Page: Patients log in with their credentials.
- Dashboard: View upcoming appointments.
- Option to cancel or reschedule appointments.
- Appointment Booking: Book new appointments with available doctors.


### Appointment Booking Process

```
Step 1: Patient selects the doctor.
```
```
Step 2: Patient selects the preferred date and time.
```
```
Step 3: Doctor reviews the request and confirms or rejects it.
```
```
Step 4: Patient receives confirmation or rejection notification.
```
```
Step 5: Patient can cancel or reschedule appointments.
```

- Upcoming Appointments: List of future appointments.
- Cancel/Reschedule: Option to cancel or reschedule an appointment.
- Personal Profile: View personal details and medical
    history.

##### Patient Dashboard Features


### Doctor Dashboard Features

- Appointment Requests: View requests for new appointments.
- Manage Appointments: Accept or reject appointments.
- Patient Details: Access patient history and medical data.
- Availability: Set available time slots for appointments.


- Admin Dashboard: Overview of all patients,

###### doctors, and appointments.

- Manage Users: Admin can create, edit, or

###### delete patient and doctor profiles.

- Appointment Management: Admin has full

###### control over all appointments, with the ability

###### to reschedule, cancel, or approve

###### appointments.

##### Admin Panel


### Database Structure

```
Tables:
```
- Patients: Stores patient details (name,age,gender,phone,email,address).
- Doctors: Stores doctor profiles (name ,specialization, phone,email).
- Appointments: Tracks appointment requests, date, and time.


#### Security & Authentication

- Login System:Secure login for both doctors and
    patients using Django authentication.
- Role-Based Access:Different permissions for Admin,
    Doctor, and Patient.
- Password Protection:Passwords are encrypted and
    securely stored using Django's authentication system.


#### Conclusion & Future Enhancements

```
Achievements:
```
- A fully functional hospital management system for efficient handling of patients,
    doctors, and appointments.
Future Enhancements:
- Implement SMS/email notifications for appointment reminders.
- Integrate payment systems for online consultation fees.
- Add advanced features like prescription management and patient feedback.


## Thank you!