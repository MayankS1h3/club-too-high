# **Club Too High \- Design & Layout Guide (V1)**

## **Guiding Philosophy**

This document translates the structural wireframe into a concrete design plan. The aesthetic goal is to create a user interface that is **dark, modern, and energetic**, reflecting the premium vibe of a nightclub. The layout will be clean and intuitive, focusing on high-quality visuals and clear calls to action.

## **1\. Visual Identity**

### **Color Palette**

The palette is designed to be moody and immersive, with a vibrant accent for an electric, neon feel.

* **Primary Background:** \[\#111111\] (A very dark charcoal, almost black)  
* **Accent / Call to Action:** \[\#00FFFF\] (A bright, electric cyan)  
* **Primary Text:** \[\#E0E0E0\] (A light gray, for readability against the dark background)  
* **Secondary** Text **/ Borders:** \[\#444444\] (A dark gray for subtle dividers and borders)

### **Typography**

* **Headlines & Titles:** **Montserrat**, Bold (Weight: 700). Modern, stylish, and impactful.  
* **Body Text & Paragraphs:** **Inter**, Regular (Weight: 400). Clean, highly legible, and neutral.

## **2\. Global Styles & Layout**

* **Spacing:** Use a consistent spacing system (e.g., multiples of 8px) for all padding and margins to create a clean, rhythmic layout. Sections should have significant vertical padding (e.g., 64px or 96px) to feel distinct.  
* **Buttons:**  
  * **Primary Button (btn-primary):** Solid cyan background (\#00FFFF) with dark text. On hover, it should have a subtle glow or scale effect.  
  * **Secondary Button (btn-secondary):** Transparent background with a 1px cyan border and cyan text. On hover, the background should fill with the cyan color.  
* **Layout:** The website will be a single-column layout on mobile devices. On desktop, sections will use grids or multi-column layouts as specified below.

## **3\. Homepage Breakdown**

### **3.1. Header Section**

* **Layout:** Full-width, 80px height, with horizontal padding. It starts as a semi-transparent overlay on the hero video and transitions to a solid \#111111 background on scroll. It remains fixed ("sticky") at the top.  
* **Components:**  
  * **Left Side:** \[Club Too High Logo\] \- A stylized logo, likely in white or cyan.  
  * **Center (Navigation Links):** \[HOME\] \[EVENTS\] \[GALLERY\] \[ABOUT US\] \[CONTACT\]. Font: Inter, medium weight. Links have a subtle hover effect where the text glows with the cyan accent color.  
  * **Right Side (Authentication):**  
    * **Before Login:** Display two buttons, spaced 16px apart.  
      * \[Login Button\] \- Styled as a secondary button.  
      * \[Signup Button\] \- Styled as a primary button to draw attention.  
    * **After Login:** The "Login" and "Signup" buttons are hidden and replaced by:  
      * \[User Avatar\] \- A small circular image of the user's profile picture (or a default icon). Clicking this should open a dropdown menu with a link to "My Bookings" and a "Logout" option.

### **3.2. Hero Section**

* **Layout:** Full-screen (100vh). A full-screen video autoplays in the background. A dark overlay (rgba(0, 0, 0, 0.5)) sits on top of the video to ensure text is readable.  
* **Components:**  
  * **Background:** \[Full-screen looping video of club interior\]  
  * **Center (Overlay Text):**  
    * Large Headline (font: Montserrat, Bold, 72px): "Redefine Your Night"  
    * Sub-headline (font: Inter, Regular, 20px): "The peak of nightlife entertainment."  
  * **Lower Center (Call to Action Buttons):**  
    * \[VIEW UPCOMING EVENTS\] \- Styled as a primary button.  
    * \[BOOK A TABLE\] \- Styled as a secondary button. Spaced 24px apart.

### **3.3. Events Preview Section**

* **Layout:** Full-width section with significant vertical padding.  
* **Components:**  
  * **Section Title** (font: Montserrat, Bold, 48px, centered): "This Week's Lineup"  
  * **Event Cards Grid:** A 3-column grid on desktop, 1-column on mobile. A 48px gap between cards.  
    * **Each Card:** Rounded corners, subtle dark gray border (\#444444). On hover, the card should lift up with a soft shadow or a cyan glow effect on the border.  
      * \[Event Poster Image\] \- Fills the top portion of the card.  
      * Card Body (with padding):  
        * \[Event Title\] (font: Montserrat, Bold, 24px)  
        * \[Date & Time\] (font: Inter, Regular, text color \#E0E0E0)  
        * \[DJ Name\] (font: Inter, Italic)  
        * \[Book Now Button\] \- Primary button, right-aligned.

### **3.4. Gallery Preview Section**

* **Layout:** A full-width section.  
* **Components:**  
  * **Section Title** (centered): "Glimpses From The Floor"  
  * **Image Grid:** A 4-column masonry grid (images of different heights fit together). 16px gap between images.  
    * **Each Image:** On hover, apply a dark overlay and a "zoom" icon in the center to indicate it can be clicked.  
  * **Button** (centered, below the grid): \[VIEW FULL GALLERY\] \- Secondary button.

### **3.5. Footer Section**

* **Layout:** A large, full-width footer with a solid \#111111 background and significant padding.  
* **Components:**  
  * A 4-column layout on desktop.  
  * **Column 1: Logo & Mission:** \[Club Too High Logo\] and a short tagline.  
  * **Column 2: Quick Links:** \[Home\], \[Events\], \[Gallery\], etc.  
  * **Column 3: Contact Info:** \[Address\], \[Phone for Reservations\], \[Email\].  
  * **Column 4: Social Media:** \[Instagram\], \[Facebook\], \[YouTube\] icons. Icons are monochrome, turning cyan on hover.  
  * **Bottom Bar:** A thin horizontal line (\`1px solid \#4