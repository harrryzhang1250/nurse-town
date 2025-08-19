# Nurse Town - Nursing Simulation Training Platform

A comprehensive nursing simulation training platform built with React, TypeScript, and AWS Amplify Gen 2. This platform provides interactive simulation experiences for nursing students with progress tracking, surveys, and comprehensive feedback systems.

## 🚀 Features

- **Multi-Level Simulations**: Three progressive simulation levels with increasing complexity
- **User Authentication**: Secure user management with AWS Cognito
- **Progress Tracking**: Comprehensive step-by-step progress monitoring
- **Survey System**: Pre and post-simulation surveys with detailed feedback
- **Chat History**: Complete simulation interaction logging
- **Admin Panel**: User management and response monitoring
- **Responsive Design**: Modern UI built with Mantine components

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Mantine UI
- **Backend**: AWS Amplify Gen 2 + Lambda + DynamoDB + Cognito
- **State Management**: Redux Toolkit
- **Authentication**: AWS Cognito User Pool
- **Database**: Amazon DynamoDB
- **API**: REST API with Lambda functions

## 📁 Project Structure

```
nurse-town/
├── amplify/                          # Backend infrastructure
│   ├── auth/                        # Authentication configuration
│   │   └── resource.ts             # Cognito User Pool setup
│   ├── data/                        # Data models
│   │   └── resource.ts             # DynamoDB table definitions
│   ├── functions/                   # Lambda functions (manually created)
│   │   ├── simulation-data-function/  # Simulation data management
│   │   │   ├── handler.ts          # Lambda function logic
│   │   │   ├── resource.ts         # Function resource definition
│   │   │   └── package.json        # Function dependencies
│   │   ├── debrief-function/       # Simulation debrief handling
│   │   ├── pre-survey-function/    # Pre-simulation surveys
│   │   ├── post-survey-function/   # Post-simulation surveys
│   │   ├── cognito-user-function/  # User management
│   │   └── shared/                 # Shared utilities and types
│   │       ├── database.ts         # DynamoDB operations
│   │       ├── http.ts             # HTTP response helpers
│   │       ├── index.ts            # Shared exports
│   │       └── utils.ts            # Utility functions
│   ├── backend.ts                  # Main backend configuration
│   └── package.json                # Backend dependencies
├── src/                             # Frontend React application
│   ├── AdminControl/               # Admin panel components
│   ├── MainApp/                    # Main application components
│   │   ├── SideBar/               # Navigation sidebar
│   │   └── StepContents/          # Step-by-step content
│   │       ├── InformedConsent/   # Consent forms
│   │       ├── Level1Simulation/  # First simulation level
│   │       ├── Level2Simulation/  # Second simulation level
│   │       ├── Level3Simulation/  # Third simulation level
│   │       ├── PreSurvey/         # Pre-simulation surveys
│   │       ├── PostSurvey/        # Post-simulation surveys
│   │       └── SimulationTutorial/# Tutorial content
│   ├── shared/                     # Shared components and utilities
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   ├── reducer.tsx                 # Redux state management
│   └── store.ts                    # Redux store configuration
├── package.json                     # Frontend dependencies
├── vite.config.ts                   # Vite build configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** 
- **Git**
- **AWS CLI** (optional, for production deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/harrryzhang1250/nurse-town
cd nurse-town
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd amplify
npm install
cd ..
```

### 3. Start Local Development Environment

#### Start Amplify Sandbox (Backend)

```bash
cd amplify
npx ampx sandbox
```

This will start the local development environment with:
- Local DynamoDB tables
- Local Lambda functions
- Local API Gateway
- Local Cognito User Pool

#### Start Frontend Development Server

```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Environment Configuration

### Backend Configuration

The backend configuration is handled automatically by Amplify Sandbox. Key configurations are in:

- `amplify/backend.ts` - Main backend setup
- `amplify/data/resource.ts` - Database schema
- `amplify/auth/resource.ts` - Authentication setup

## 🎯 Development Workflow

### 1. Backend Development

#### Adding New Lambda Functions

Lambda functions are created manually in this project:

1. **Create Function Folder Structure**
   ```bash
   cd amplify/functions
   mkdir my-new-function
   cd my-new-function
   ```

2. **Create Function Files**
   - `handler.ts` - Main Lambda function logic
   - `resource.ts` - Function resource definition
   - `package.json` - Function dependencies

3. **Add to Backend Configuration**
   Edit `amplify/backend.ts`:
   ```typescript
   import { myNewFunction } from "./functions/my-new-function/resource";
   
   const backend = defineBackend({
     auth,
     data,
     // ... other resources
     myNewFunction, // Add your new function
   });
   ```

4. **Configure Table Permissions**
   ```typescript
   // Grant table permissions
   const tableMap = [
     // ... existing tables
     backend.data.resources.tables["YourTableName"],
   ];
   
   // Assign permissions
   tableMap[tableIndex].grantReadWriteData(backend.myNewFunction.resources.lambda);
   ```

5. **Set Environment Variables**
   ```typescript
   // Add table name environment variable
   backend.myNewFunction.addEnvironment("TABLE_NAME", tableMap[tableIndex].tableName);
   ```

6. **Restart Sandbox**
   ```bash
   npx ampx sandbox restart
   ```

#### Modifying Database Schema

Edit `amplify/data/resource.ts` and restart the sandbox:

```bash
npx ampx sandbox restart
```

#### Testing API Endpoints

Use the sandbox console to test your APIs:

```bash
npx ampx sandbox console
```

### 2. Lambda Function Development Guide

#### Function Structure

Each Lambda function follows this structure:

```
my-function/
├── handler.ts          # Main function logic
├── resource.ts         # Function resource definition
└── package.json        # Function dependencies
```

#### Example Function Files

**`handler.ts`** - Main function logic:
```typescript
import type { APIGatewayProxyHandler } from "aws-lambda";
import { 
  createResponse, 
  optionsResponse, 
  badRequestResponse,
  // ... other imports
} from "../shared";

export const handler: APIGatewayProxyHandler = async (event) => {
  // Function implementation
};
```

**`resource.ts`** - Function resource definition:
```typescript
import { defineFunction } from "@aws-amplify/backend";

export const myFunction = defineFunction({
  name: "my-function",
  entry: "./handler.ts",
});
```

**`package.json`** - Function dependencies:
```json
{
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.0.0",
    "@aws-sdk/lib-dynamodb": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### Shared Utilities

Use the shared utilities in `amplify/functions/shared/`:

- **`database.ts`** - DynamoDB operations (getItem, putItem, etc.)
- **`http.ts`** - HTTP response helpers (createResponse, badRequestResponse, etc.)
- **`utils.ts`** - Common utility functions
- **`index.ts`** - Centralized exports

#### Function Integration Steps

1. **Import in backend.ts**
2. **Add to backend definition**
3. **Configure permissions**
4. **Set environment variables**
5. **Add to API Gateway (if needed)**
6. **Restart sandbox**

### 3. Frontend Development

#### Adding New Components

Create new components in the appropriate directory under `src/` and import them where needed.

#### State Management

Use Redux Toolkit for global state management. Add new slices in `src/reducer.tsx`.

#### API Integration

Use the shared `simulationClient.ts` for API calls or create new client functions as needed.

## 🗄️ Database Schema

### Tables

- **PreSurveyAnswers**: Pre-simulation survey responses
- **PostSurveyAnswers**: Post-simulation survey responses  
- **SimulationData**: Simulation interaction logs
- **DebriefAnswers**: Simulation debrief responses

### Key Fields

All tables include:
- `userID`: User identifier
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp
- Additional fields are automatically handled and stored

## 🔐 Authentication

The platform uses AWS Cognito for user authentication:

- **User Registration**: Admin-controlled user creation
- **User Login**: Email/password authentication
- **Session Management**: Automatic token refresh
- **Authorization**: Role-based access control

## 📚 API Documentation

### Endpoints

- **POST** `/simulation-data` - Save simulation data
- **GET** `/simulation-data` - Retrieve simulation data
- **POST** `/debrief` - Submit debrief responses
- **GET** `/debrief` - Get debrief data
- **POST** `/pre-survey` - Submit pre-simulation survey
- **GET** `/pre-survey` - Get pre-simulation survey
- **POST** `/post-survey` - Submit post-simulation survey
- **GET** `/post-survey` - Get post-simulation survey
- **POST** `/cognito-user` - Create new user
- **GET** `/cognito-user` - Get user information

### Request/Response Format

All endpoints support additional fields that are automatically stored:

```json
{
  "userID": "user123",
  "simulationLevel": 1,
  "simulationData": {...},
  "sessionNotes": "User performed well",  // Additional field
  "difficulty": "medium"                  // Additional field
}
```

## 🐛 Troubleshooting

### Common Issues

#### Sandbox Not Starting

```bash
# Check if ports are available
lsof -i :3000
lsof -i :5173

# Restart sandbox
cd amplify
npx ampx sandbox restart
```

#### Frontend Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues

```bash
# Check sandbox status
cd amplify
npx ampx sandbox status

# Restart sandbox
npx ampx sandbox restart
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the [Amplify Documentation](https://docs.amplify.aws/)
- Review the [Amplify Gen 2 Guide](https://docs.amplify.aws/gen2/)
- Open an issue in this repository

## 🔄 Updates

This project uses:
- **Amplify Gen 2** for the latest backend features
- **React 18** with modern hooks and features
- **TypeScript** for type safety
- **Mantine UI** for consistent design components

---
