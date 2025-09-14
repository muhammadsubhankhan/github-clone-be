# GitHub Issue Tracker Clone - Backend API

A mini GitHub Issue Tracker Clone built with NestJS, MongoDB, and JWT authentication. This backend API provides authentication, repository management, and issue tracking functionality.

## �� Live URLs

- **Backend API**: [http://34.215.0.173/api-docs#/](http://34.215.0.173/api-docs#/)
- **Frontend Application**: [https://github-clone-fe-af7f.vercel.app/login](https://github-clone-fe-af7f.vercel.app/login)
- **API Documentation**: [Swagger UI](http://34.215.0.173/api-docs#/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup Guide](#local-setup-guide)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- **Authentication & Authorization**

  - User registration and login
  - JWT-based authentication
  - Role-based access control (Owner, Collaborator, Viewer)
  - Password hashing with bcrypt

- **Repository Management**

  - Create and manage repositories
  - Repository access control
  - Collaborator management

- **Issue Tracking**

  - Create, update, and delete issues
  - Issue status management
  - Label and assignee support
  - Issue filtering and search

- **User Management**
  - User profile management
  - Role-based permissions
  - Secure password handling

## 🛠 Tech Stack

- **Backend Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **Logging**: Pino

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

## 🚀 Local Setup Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd github-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

1. Copy the environment example file:

```bash
cp env.example .env
```

2. Update the `.env` file with your configuration (see [Environment Variables](#environment-variables) section)

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` in your `.env` file to `mongodb://localhost:27017/github-tracker`

### 5. Run the Application

````bash
# Development mode
npm run start:dev

### Deployment Steps

1. **Build the application**:
```bash
npm run build
````

2. **Set up environment variables** in your production environment

3. **Start the application**:

```bash
npm run start:prod
```

### PM2 Configuration

For production deployment, you can use PM2 with the provided `ecosystem.config.js`:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit
```

## 📁 Project Structure
