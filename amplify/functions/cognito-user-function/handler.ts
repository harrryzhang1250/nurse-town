import type { APIGatewayProxyHandler } from "aws-lambda";
import { 
  createResponse, 
  optionsResponse, 
  badRequestResponse, 
  conflictResponse,
  notFoundResponse, 
  methodNotAllowedResponse, 
  serverErrorResponse,
  parseJsonBody,
  getQueryParams,
  HTTP_STATUS
} from "../shared";
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminGetUserCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
const USER_POOL_ID = process.env.USER_POOL_ID;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const method = event.httpMethod;
  const queryParams = getQueryParams(event.queryStringParameters);

  // Handle OPTIONS requests for CORS
  if (method === "OPTIONS") {
    return optionsResponse();
  }

  // Validate USER_POOL_ID environment variable
  if (!USER_POOL_ID) {
    console.error("USER_POOL_ID environment variable is not set");
    return serverErrorResponse("Configuration error");
  }

  try {
    if (method === "GET") {
      return await handleGetUser(queryParams);
    }
    
    if (method === "POST") {
      return await handleCreateUser(event.body);
    }

    return methodNotAllowedResponse(["GET", "POST", "OPTIONS"]);
  } catch (error) {
    console.error("Unhandled error:", error);
    return serverErrorResponse("Internal server error");
  }
};

/**
 * Generate password satisfying Cognito default policy
 * At least 1 letter + 1 digit + 1 symbol
 */
function generatePassword(length: number = 12): string {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_-+=';
  
  // Guarantee at least one of each required character type
  const guaranteedLetter = letters[Math.floor(Math.random() * letters.length)];
  const guaranteedDigit = digits[Math.floor(Math.random() * digits.length)];
  const guaranteedSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  // Generate remaining characters
  const allChars = letters + digits + symbols;
  const remainingLength = length - 3;
  let remaining = '';
  
  for (let i = 0; i < remainingLength; i++) {
    remaining += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Combine and shuffle
  const password = guaranteedLetter + guaranteedDigit + guaranteedSymbol + remaining;
  const passwordArray = password.split('');
  
  // Fisher-Yates shuffle
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
}

/**
 * Handle POST request to create a new Cognito user
 */
async function handleCreateUser(body: string | null) {
  try {
    const payload = parseJsonBody(body);
    const { username } = payload;

    if (!username) {
      return badRequestResponse("Missing required field: username");
    }

    // Generate email from username
    const email = `${username}@nursetown.com`;
    
    // Check if user already exists
    try {
      const checkUserCommand = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email
      });
      await cognitoClient.send(checkUserCommand);
      
      // If we reach here, user already exists
      return conflictResponse("Username already exists");
    } catch (error: any) {
      console.log("User doesn't exist, proceeding with creation");
    }
    
    // Generate password using the specified method
    const password = generatePassword(12);

    // Prepare user attributes
    const userAttributes = [
      {
        Name: "email",
        Value: email
      },
      {
        Name: "email_verified",
        Value: "true"
      }
    ];

    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: userAttributes,
      MessageAction: "SUPPRESS" // Suppress welcome email
    });

    const result = await cognitoClient.send(createUserCommand);

    console.log("User created successfully:", result);

    // Set the password as permanent
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true
    });
    await cognitoClient.send(setPasswordCommand);

    return createResponse(HTTP_STATUS.OK, { 
      message: "User created successfully",
      username: email,
      password: password,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return serverErrorResponse("Failed to create user");
  }
}

/**
 * Handle GET request to retrieve user information
 */
async function handleGetUser(queryParams: Record<string, string>) {
  const username = queryParams.username;
  
  if (!username) {
    return badRequestResponse("Missing query parameter: username");
  }

  try {
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    });
    
    const result = await cognitoClient.send(getUserCommand);
    
    if (!result.Username) {
      return badRequestResponse("User not found");
    }

    // Extract user information
    const userInfo = {
      username: result.Username,
      userStatus: result.UserStatus,
      attributes: result.UserAttributes?.reduce((acc: any, attr: any) => {
        if (attr.Name && attr.Value) {
          acc[attr.Name] = attr.Value;
        }
        return acc;
      }, {}),
    };

    return createResponse(HTTP_STATUS.OK, userInfo);
  } catch (error) {
    console.error("Error getting user:", error);
    return serverErrorResponse("Failed to retrieve user information");
  }
}
