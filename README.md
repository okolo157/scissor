# Scissor URL Shortener

Scissor is a simple and effective URL shortening service. This project allows users to input a long URL and receive a shortened version, which can be easily shared and tracked. The project includes both a frontend built with React and Vite, and a backend built with Express and MongoDB.

Table of Contents
Features
Tech Stack
Installation
Backend Setup
Frontend Setup
Environment Variables
Running the Project
Deployment
Contributing
License
Features
Shorten long URLs.
View the number of clicks on each shortened URL.
Generate QR codes for shortened URLs.
Copy shortened URLs to clipboard.
Rate limiting to prevent abuse.
User-friendly interface with a video background.


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

Navigate to the backend directory:
cd backend
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
cd ../frontend


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
Backend: http://localhost:5000
Frontend: http://localhost:3000


# Deployment
**Backend Deployment**
Deploy your backend to a cloud service like Heroku, AWS, or DigitalOcean.
Ensure your MongoDB connection string is properly configured in the production environment.
Set up the production environment variables on your deployment platform.


**Frontend Deployment**
Build the frontend for production:
npm run build
or
yarn build
Deploy the frontend build folder to a static hosting service like Render, Netlify, Vercel, or GitHub Pages.

Update the VITE_SERVER_URL in your environment variables to point to the live backend URL.

This project is licensed under the MIT License - see the LICENSE file for details.
