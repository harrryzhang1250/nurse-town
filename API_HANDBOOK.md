# Nurse Town API Handbook

## Overview
This document provides API interface specifications for the Unity development team working with the Nurse Town application, including authentication and simulation data management functionality.

## Environment Configuration

### Sandbox (Development Environment)
- **Base URL**: `https://bhyalmu7i1.execute-api.us-east-1.amazonaws.com/prod`
- **Purpose**: Development and testing, data will not affect production environment

### Production (Production Environment)
- **Base URL**: `https://dxa66vt2tl.execute-api.us-east-1.amazonaws.com/prod`
- **Purpose**: Production user access, data will be permanently stored

## API Endpoints

### 1. User Authentication API

#### 1.1 User Login
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Description**: Validates user credentials and current simulation level

**Request Body**:
```json
{
  "username": "user001@nursetown.com",
  "password": "user_password"
}
```

**Success Response** (200):
```json
{
  "message": "Login successful",
  "userID": "user001@nursetown.com",
  "simulationLevel": 1
}
```

**Failure Response** (400 - Invalid Credentials):
```json
{
  "error": "Invalid username or password"
}
```

**Failure Response** (403 - All Simulations Completed):
```json
{
  "error": "You have completed all simulations. Please head to post survey.",
  "currentStep": "level-3-simulation",
  "simulationLevel": null
}
```

**Error Code Descriptions**:
- `400`: Request parameter error (missing username/password)
- `401`: User account not confirmed
- `403`: User has completed all simulations, cannot continue
- `404`: User not found
- `500`: Server internal error

#### 1.2 User Signout
- **Endpoint**: `/auth/signout`
- **Method**: `POST`
- **Description**: Simple signout confirmation

**Request Body**: None (empty JSON object is fine)
```json
{}
```

**Success Response** (200):
```json
{
  "message": "Sign out successful",
  "timestamp": "2025-08-19T18:30:00.000Z"
}
```

### 2. Simulation Data Management API

#### 2.1 Save Simulation Data
- **Endpoint**: `/simulation-data`
- **Method**: `POST`
- **Description**: Saves user's simulation session data

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "userID": "user001@nursetown.com",
  "simulationLevel": 1,
  "chatHistory": {
    "conversation": [
      {
        "speaker": "therapist",
        "message": "Hello, how are you feeling today?",
        "timestamp": "2025-08-19T18:00:00.000Z"
      },
      {
        "speaker": "patient",
        "message": "I'm feeling a bit nervous about the session.",
        "timestamp": "2025-08-19T18:00:05.000Z"
      }
    ],
    "sessionDuration": 1800,
    "interactionCount": 15,
    "patientResponses": [
      "I'm feeling a bit nervous about the session.",
      "Yes, I understand what you're asking.",
      "I think the exercises are helpful."
    ]
  }
}
```

**Field Descriptions**:
- `userID`: User email address (required)
- `simulationLevel`: Simulation level 1, 2, or 3 (required)
- `simulationData`: Simulation data object (required)
-  all the other additional attributes in any type


**Success Response** (200):
```json
{
  "message": "Simulation data saved successfully",
  "createdAt": "2025-08-19T18:30:00.000Z",
  "updatedAt": "2025-08-19T18:30:00.000Z",
  "additionalFields": [.......]
}
```

**Failure Response** (400):
```json
{
  "error": "Missing required fields: userID, simulationLevel, and simulationData"
}
```

**Failure Response** (400):
```json
{
  "error": "simulationLevel must be 1, 2, or 3"
}
```

#### 2.2 Get Simulation Data
- **Endpoint**: `/simulation-data`
- **Method**: `GET`
- **Description**: Retrieves simulation data for a specific user

**Query Parameters**:
```
?userID=user001@nursetown.com&simulationLevel=1
```

**Success Response** (200):
```json
{
  "userID": "user001@nursetown.com",
  "simulationLevel": 1,
  "chatHistory": {
    "conversation": [...],
    "sessionDuration": 1800,
    "interactionCount": 15,
    "patientResponses": [...]
  },

  "createdAt": "2025-08-19T18:00:00.000Z",
  "updatedAt": "2025-08-19T18:30:00.000Z"
}
```

**Failure Response** (400):
```json
{
  "error": "Missing query parameter: userID"
}
```

**Failure Response** (400):
```json
{
  "error": "Please specify simulationLevel parameter"
}
```

**Failure Response** (404):
```json
{
  "error": "Simulation data not found for this user and simulation level"
}
```

