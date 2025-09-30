# **Nightclub Website: Core Features & Functionality (V1)**

## **Guiding Philosophy**

This document outlines the essential features for the initial launch (Version 1\) of the nightclub website. The focus is on creating a streamlined, high-impact experience for customers while providing simple and effective management tools for staff.

## **1\. Feature: User Authentication**

**Goal:** To provide a secure and simple way for customers to create an account, which is required for booking tickets.

### **Customer-Facing Flow:**

* **Sign Up / Log In Options:**  
  * **Option 1: Google Account (OAuth):** Users can sign up or log in instantly and securely with a single click using their Google account. This is the recommended, easiest method.  
  * **Option 2: Email and Password:**  
    * **Sign Up:** Users can create an account using their email and a password.  
    * **Email Verification:** After signing up, the user receives an email with a verification link they must click to activate their account before they can log in.  
* **Log In:** Registered users can log in using either their Google account or their verified email and password.  
* **User Profile (Minimal V1):** Once logged in, a user will have a simple profile page where they can view their booking history (past and upcoming tickets).

### **Admin/Backend Functionality:**

* All user data (name, verified email, hashed password, Google profile info) will be securely managed by **Supabase Auth**.  
* The admin will be able to see a list of all registered users in the Supabase dashboard but will not have access to their passwords.

## **2\. Feature: Events Calendar & Ticketing**

**Goal:** To showcase all upcoming events in an engaging way and provide a seamless, secure system for customers to purchase tickets.

### **Customer-Facing Flow:**

* **Events Calendar Page:**  
  * A visually appealing page that displays all upcoming events, likely as a list or a grid of "event cards."  
  * Each card will show the key event details: **Event Poster**, **Title**, **Date**, and **DJ/Artist Name**.  
* **Event Details Page:**  
  * Clicking on an event card takes the user to a dedicated page for that event.  
  * This page will display the full event description, start/end times, ticket price, and a prominent **"Book Now"** button.  
* **Booking & Payment Process:**  
  1. Clicking "Book Now" opens a simple modal or form where the user can select the **number of tickets**.  
  2. The total price is calculated and displayed.  
  3. Proceeding to payment will open the secure **Razorpay payment modal**.  
  4. The user completes the payment using their preferred method (UPI, card, etc.).  
  5. Upon successful payment, the user is redirected to a "Booking Confirmed" page.  
  6. The user immediately receives a **confirmation email** containing their e-ticket, which could include a **QR code**.

### **Admin Functionality (via Supabase Dashboard):**

* **Add/Update/Delete Events:** The club manager will log into the Supabase dashboard and directly edit the events table.  
  * **To add an event:** They create a new row and fill in the columns for title, date, djName, ticketPrice, etc.  
  * **To add a poster:** They upload the image to Supabase Storage and paste the image URL into the posterImageUrl column for that event.  
  * **To delete an event:** They simply delete the corresponding row.

## **3\. Feature: Photo Gallery**

**Goal:** To showcase the vibe and energy of the nightclub with a gallery of high-quality photos from past events.

### **Customer-Facing Flow:**

* A dedicated "Gallery" page on the website.  
* Images will be displayed in a modern, responsive grid layout.  
* Clicking on any image will open it in a full-screen "lightbox" view, allowing users to swipe or click through the photos.

### **Admin Functionality (via Supabase Dashboard):**

* **Add Photos:** The manager will navigate to the "Storage" section in the Supabase dashboard and upload new photos to a designated "gallery" bucket.  
* **Manage Photos:** The gallery\_images table will automatically be populated (using a database trigger) or manually updated by the manager with the URLs of the new photos.  
* **Delete Photos:** To remove a photo from the website, the manager simply deletes the corresponding row from the gallery\_images table.

## **4\. Feature: Booking & Guest List Management (Admin)**

**Goal:** To provide an easy way for staff to view and manage the guest list for any upcoming event.

### **Admin Functionality (via Supabase Dashboard):**

* The manager logs into Supabase and navigates to the bookings table.  
* They can **filter** the table by the **eventId** to see a complete list of all customers who have booked tickets for a specific upcoming event.  
* This list will contain the **customer's name, email/phone, and the number of tickets** they purchased. This serves as the official guest list for the door staff.  
* A search bar within the Supabase table view can be used to quickly find a guest by name.

## **5\. Standard Pages**

**Goal:** To provide essential information to customers. These will be static pages that rarely change.

* **Home Page:** The main landing page with a hero video, links to upcoming events, and a gallery preview.  
* **Menu Page:** A simple, elegant page displaying the food and drink menus (likely as high-quality images or a well-formatted text page).  
* **About Us:** A page detailing the story and vibe of the nightclub.  
* **Contact Page:** Information including address (with a Google Maps embed), phone numbers for reservations, and a contact form.