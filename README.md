# GitHub Profile Analyzer

A full-stack application to fetch, analyze, and store GitHub user profiles with comprehensive insights and metrics.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## 🎯 Project Overview

GitHub Profile Analyzer is a web application that allows users to search for GitHub profiles, fetch detailed profile information, and store it in a database for further analysis. The application f[...]

## ✨ Features

- **GitHub Profile Search**: Fetch detailed information about any GitHub user
- **Profile Storage**: Store and manage GitHub profiles in a MySQL database
- **Rate Limiting**: Built-in request rate limiting to prevent API abuse
- **CORS Support**: Secure cross-origin resource sharing configuration
- **API Documentation**: Interactive Swagger UI for exploring API endpoints
- **Health Check**: Server status monitoring endpoint
- **Validation**: Input validation using Joi schema validation
- **Error Handling**: Comprehensive error handling and meaningful error messages

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MySQL (mysql2 v3.22.5)
- **Validation**: Joi (v18.2.3)
- **HTTP Client**: Axios (v1.18.0)
- **Security**: 
  - CORS (v2.8.6)
  - Express Rate Limit (v8.5.2)
  - dotenv (v17.4.2)
- **API Documentation**: Swagger UI Express (v5.0.1)

### Frontend
- React.js and Tailwind CSS

## 📁 Project Structure

```
GithubProfileAnalyzer/
├── Backend/
│   ├── Controller/          # Request handlers and business logic
│   ├── Router/              # API route definitions
│   ├── Service/             # Business logic and GitHub API integration
│   ├── Database/            # Database connection and queries
│   ├── Middleware/          # Custom middleware (authentication, logging, etc.)
│   ├── Utilities/           # Helper functions and utilities
│   ├── index.js             # Server entry point
│   ├── package.json         # Backend dependencies
│   ├── package-lock.json    # Dependency lock file
│   └── swagger.json         # API documentation
├── Frontend/                # Frontend application
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL Server
- GitHub Personal Access Token (for higher API rate limits)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:
```env
PORT=8800
DATABASE_HOST=your_db_host
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
GITHUB_TOKEN=your_github_personal_access_token
AllowedOrigins=http://localhost:3000,http://localhost:5173
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:8800` by default.

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8800 |
| `DATABASE_HOST` | MySQL host address | - |
| `DATABASE_USER` | MySQL username | - |
| `DATABASE_PASSWORD` | MySQL password | - |
| `DATABASE_NAME` | Database name | - |
| `GITHUB_TOKEN` | GitHub API personal access token | - |
| `AllowedOrigins` | CORS allowed origins (comma-separated) | - |

### MySQL Database Setup

The application expects a MySQL database to store fetched GitHub profiles. Below are the SQL commands to create the database and the required table.

1. Create the database:

```sql
CREATE DATABASE IF NOT EXISTS `github_analyzer`;
USE `github_analyzer`;
```

2. Create the `github_profiles` table:

```sql
CREATE TABLE `github_profiles` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `url` varchar(512) DEFAULT NULL,
  `html_url` varchar(255) NOT NULL,
  `followers_url` varchar(512) DEFAULT NULL,
  `following_url` varchar(512) DEFAULT NULL,
  `gists_url` varchar(512) DEFAULT NULL,
  `starred_url` varchar(512) DEFAULT NULL,
  `subscriptions_url` varchar(512) DEFAULT NULL,
  `organizations_url` varchar(512) DEFAULT NULL,
  `repos_url` varchar(512) DEFAULT NULL,
  `events_url` varchar(512) DEFAULT NULL,
  `received_events_url` varchar(512) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `user_view_type` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `blog` varchar(512) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hireable` tinyint(1) DEFAULT NULL,
  `bio` text,
  `twitter_username` varchar(255) DEFAULT NULL,
  `public_repos` int DEFAULT '0',
  `public_gists` int DEFAULT '0',
  `followers` int DEFAULT '0',
  `following` int DEFAULT '0',
  `account_created_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`user_id`)
);
```

### Rate Limiting

The API implements rate limiting with the following configuration:
- **Window**: 15 minutes
- **Limit**: 100 requests per IP address
- **Message**: "Too many requests, please try again later."

## 💻 Usage

### Starting the Server

```bash
npm start
```

The server will start and display:
```
running on 8800
```

### Health Check

To verify the server is running:
```bash
curl http://localhost:8800/health
```

Response:
```json
{
  "message": "server status: running"
}
```

### Access Swagger Documentation

Open your browser and navigate to:
```
http://localhost:8800/api/docs
```

## 📚 API Documentation

The API is fully documented using Swagger/OpenAPI 3.0. Interactive documentation is available at `/api/docs`.

### API Endpoints

#### 1. Fetch GitHub Profile and Store
- **Endpoint**: `POST /fetch-git-profile/{username}`
- **Description**: Fetches GitHub profile data for the specified username and stores it in the database
- **Parameters**: 
  - `username` (path, required): GitHub username to fetch
- **Response**: 
  - `200`: Profile fetched and stored successfully
  - `400`: Invalid username or request
  - `404`: GitHub profile not found

#### 2. Fetch All Stored Profiles
- **Endpoint**: `GET /fetch-profiles`
- **Description**: Returns all GitHub profiles stored in the database
- **Response**: 
  - `200`: List of stored GitHub profiles

#### 3. Fetch Specific Stored Profile
- **Endpoint**: `GET /fetch-profile/{username}`
- **Description**: Returns the stored GitHub profile for the specified username
- **Parameters**: 
  - `username` (path, required): GitHub username to retrieve
- **Response**: 
  - `200`: Profile retrieved successfully
  - `404`: Stored profile not found

#### 4. Delete Stored Profile
- **Endpoint**: `DELETE /delete-git-profile/{username}`
- **Description**: Deletes the stored GitHub profile for the specified username
- **Parameters**: 
  - `username` (path, required): GitHub username to delete
- **Response**: 
  - `200`: Profile deleted successfully
  - `404`: Profile not found

## 🌐 Deployment

The application is deployed and accessible at:
- **Development Server**: https://githubprofileanalyzer-93qb.onrender.com/
- **API Documentation Swagger **:https://githubprofileanalyzer-93qb.onrender.com/api/docs/#/

