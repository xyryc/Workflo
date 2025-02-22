# Workflo

Work is a task management web application where users can add, edit, and reorder tasks using a drag-and-drop interface. Tasks are categorized into three sections: To-Do, In Progress, and Done. Changes are instantly saved to the database to ensure persistence. The app features a clean, minimalistic UI and is fully responsive for both desktop and mobile users. This project tests the ability to handle frontend interactivity, backend data management, and real-time synchronization while working within a structured design system.

## Live

- [Workflo Live Site](https://workflo.web.app/)
- [Workflo Backup Site](http://workflo.surge.sh/)

## Dependencies

### Runtime Dependencies

- `@dnd-kit/core`: ^6.3.1
- `@dnd-kit/modifiers`: ^9.0.0
- `@dnd-kit/sortable`: ^10.0.0
- `@radix-ui/react-alert-dialog`: ^1.1.6
- `@radix-ui/react-dialog`: ^1.1.6
- `@radix-ui/react-dropdown-menu`: ^2.1.6
- `@radix-ui/react-label`: ^2.1.2
- `@radix-ui/react-select`: ^2.1.6
- `@radix-ui/react-slot`: ^1.1.2
- `@tanstack/react-query`: ^5.66.8
- `axios`: ^1.7.9
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `firebase`: ^11.3.1
- `lucide-react`: ^0.475.0
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `react-hot-toast`: ^2.5.2
- `react-router`: ^7.2.0
- `tailwind-merge`: ^3.0.1
- `tailwindcss-animate`: ^1.0.7

### Development Dependencies

- `@eslint/js`: ^9.19.0
- `@types/node`: ^22.13.4
- `@types/react`: ^19.0.8
- `@types/react-dom`: ^19.0.3
- `@vitejs/plugin-react`: ^4.3.4
- `autoprefixer`: ^10.4.20
- `eslint`: ^9.19.0
- `eslint-plugin-react`: ^7.37.4
- `eslint-plugin-react-hooks`: ^5.0.0
- `eslint-plugin-react-refresh`: ^0.4.18
- `globals`: ^15.14.0
- `postcss`: ^8.5.3
- `tailwindcss`: ^3.4.17
- `vite`: ^6.1.0

# Installation Guide

## Frontend Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/xyryc/Workflo
   cd Workflo/Workflo-client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory of the frontend project and add the following Firebase configuration and API URL:

   ```bash
    VITE_apiKey=your_api_key
    VITE_authDomain=your_auth_domain
    VITE_projectId=your_project_id
    VITE_storageBucket=your_project_bucket
    VITE_messagingSenderId=your_messaging_sender_id
    VITE_appId=your_app_id
    VITE_API_URL=your_backend_server_url
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open the app in your browser:**
   ```bash
   http://localhost:5173/
   ```

## Backend Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/xyryc/Workflo
   cd Workflo/Workflo-server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the backend project and add the following config:

   ```bash
    DB_USER=database_username
    DB_PASS=database_password
    ACCESS_TOKEN_SECRET=access_token_secret
   ```

4. **Run the development server:**
   ```bash
   nodemon index.js
   ```
5. **Open the app in your browser:**
   ```bash
   http://localhost:5000
   ```

## Technologies Used

### Frontend:

- **React.js** – UI library for building the frontend.
- **Vite.js** – Fast build tool for frontend development.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **dnd-kit** – Drag-and-drop library for smooth interactions.
- **Shadcn/UI** – Modern UI component library.
- **Lucide React Icons** – Icon library for UI enhancements.
- **TanStack Query (React Query)** – Data fetching and state management.
- **React Router** – Client-side routing.
- **React Hot Toast** – Notification system.

### Backend:

- **Node.js** – JavaScript runtime for backend development.
- **Express.js** – Web framework for Node.js.
- **MongoDB** – NoSQL database for storing application data.
- **Firebase Authentication** – User authentication.
- **JWT (JSON Web Token)** – Secure user authentication and authorization.
- **Cookie Parser** – Middleware for handling cookies.
- **CORS** – Middleware for handling cross-origin requests.
- **dotenv** – Environment variable management.
