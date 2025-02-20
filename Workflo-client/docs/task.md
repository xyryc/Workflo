### **Overview:**

You are required to build a **Task Management Application** where users can add, edit, delete, and reorder tasks using a **drag-and-drop** interface. Tasks will be categorized into three sections: **To-Do, In Progress, and Done**. Changes must be **saved instantly** to the database to maintain persistence.

The app should have **a clean, minimalistic UI** and be **fully responsive** for both desktop and mobile users.

This task will test your ability to handle **frontend interactivity**, **backend data management**, and **real-time synchronization** while working within a structured design system.

---

## **Key Features & Requirements:**

### **1\. Authentication:**

* Only **authenticated users** can access the app.  
* Use **Firebase Authentication** (Google sign-in is sufficient).  
* Store user details (User ID, email, and display name) in the database upon first login.

### **2\. Task Management System:**

* Users should be able to **add, edit, delete**, and **reorder** tasks.  
* Tasks belong to one of three categories:  
  * **To-Do**  
  * **In Progress**  
  * **Done**  
* Users can drag a task from one category to another.  
* Users can reorder tasks within a category.  
* The changes should be **saved instantly** in the database.  
* Each task should have the following:  
  * **Title** (required, max 50 characters)  
  * **Description** (optional, max 200 characters)  
  * **Timestamp** (auto-generated upon creation)  
  * **Category** (To-Do, In Progress, Done)

### **3\. Database & Persistence:**

* Use **MongoDB (via Express.js server)** to store tasks.  
* Ensure **real-time updates** so that tasks remain in their last known order when the user refreshes or reopens the app.  
* When a user deletes a task, it should be **permanently removed** from the database.  
* **Hint:** You can use one of the following approaches to ensure instant syncing:  
  * **MongoDB Change Streams**: This allows listening for real-time changes in the database and updating the frontend accordingly.  
  * **WebSockets**: Set up a WebSocket connection to push real-time updates to the frontend when a task is modified.  
  * **Optimistic UI Updates**: Update the frontend state immediately after a change, then sync it with the backend in the background.  
  * **Polling (if necessary)**: As a fallback, periodically fetch the latest task data from the server.

### **4\. Frontend UI:**

* Use **Vite.js \+ React** for the frontend.  
* Use **a drag-and-drop library** (for example: react-beautiful-dnd or you can explore any other library).  
* The UI should be **modern, clean, and responsive**.  
* You can use a maximum of **four colors** for the design to maintain a clean look.

### **5\. Responsiveness:**

* The app should work smoothly on **both desktop and mobile devices**.  
* Ensure a mobile-friendly **drag-and-drop** experience.

### **6\. Backend:**

* Set up an **Express.js API** to handle CRUD operations.  
* Store tasks in a **MongoDB database**   
* Endpoints should include:  
  * POST /tasks – Add a new task  
  * GET /tasks – Retrieve all tasks for the logged-in user  
  * PUT /tasks/:id – Update task details (title, description, category)  
  * DELETE /tasks/:id – Delete a task

## **Bonus (Optional but Recommended):**

* Add a **dark mode toggle**.  
* Implement **task due dates** with color indicators (e.g., overdue tasks appear red).  
* Include a **simple activity log** to track changes (e.g., "Task moved to Done").

## **Submission Guidelines:**

* Submit the live link of the application.  
* Submit individual **GitHub repository links** for both frontend and backend.( Single repository link with separate folders for frontend and backend will be accepted as well)  
* Include a well-structured README file.  
* The README should include:  
  * Short Description.  
  * Live links.  
  * Dependencies.  
  * Installation steps  
  * Technologies used  
* Ensure **code cleanliness**, use proper **folder structure**, and follow **best practices**.