# Scissor URL Shortener

Scissor is a simple and effective URL shortening service. This project allows users to input a long URL and receive a shortened version, which can be easily shared and tracked. The project includes both a frontend built with React and Vite, and a backend built with Express and MongoDB.

# Tech Stack
Frontend: React, Vite, TypeScript, Tailwind CSS
Backend: Node.js, Express, MongoDB
Others: Mongoose, Axios, React Router, Express-rate-limit, dotenv, CORS, nanoid

# Installation Prerequisites
Node.js (v14.x or higher)
npm or Yarn
MongoDB (local or cloud instance)


# Backend Setup
Clone the repository:
git clone https://github.com/vik1234-del/scissor.git
cd scissor/url-shortner

Navigate to the directory:
Install dependencies:
npm install
**or**
yarn install


Create a .env file based on the .env.example and configure the environment variables:
cp .env.example .env


# Environment Variables:
PORT: The port on which the server will run (default: 5000).
MONGO_URI: The MongoDB connection string.
JWT_SECRET: Secret key for JWT authentication.


Start the backend server:
npm run dev
**or**
yarn dev


# Frontend Setup
Navigate to the frontend directory:
e.g cd ../client-app


Install dependencies:
npm install
**or**
yarn install
Create a .env file based on the .env.example and configure the environment variables:


cp .env.example .env
Environment Variables:

VITE_SERVER_URL: 
The backend API URL (e.g., http://localhost:5000/api for development).

Start the frontend development server:
npm run dev
**or**
yarn dev


**Running the Project**
To run the project, ensure both the backend and frontend servers are running.
e.g

Backend: http://localhost:5000
Frontend: http://localhost:3000


# Deployment
**Backend Deployment**
Deploy the backend to a cloud service like Heroku, AWS, or DigitalOcean.
Ensure the MongoDB connection string is properly configured in the production environment.
Set up the production environment variables on your deployment platform.


**Frontend Deployment**
Build the frontend for production:
npm run build
Deploy the frontend build folder to a static hosting service like Render, Netlify, Vercel, or GitHub Pages.

Update the VITE_SERVER_URL in your environment variables to point to the live backend URL.

This project is licensed under the MIT License - see the LICENSE file for details.
