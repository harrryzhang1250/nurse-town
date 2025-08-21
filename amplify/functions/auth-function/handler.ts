import type { APIGatewayProxyHandler } from "aws-lambda";
import { 
  createResponse, 
  optionsResponse, 
  badRequestResponse, 
  methodNotAllowedResponse, 
  serverErrorResponse,
  parseJsonBody,
  HTTP_STATUS
} from "../shared";
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const method = event.httpMethod;

  // Handle OPTIONS requests for CORS
  if (method === "OPTIONS") {
    return optionsResponse();
  }

  // Validate environment variables
  if (!USER_POOL_ID) {
    console.error("USER_POOL_ID environment variable is not set");
    return serverErrorResponse("Configuration error");
  }

  if (!CLIENT_ID) {
    console.error("CLIENT_ID environment variable is not set");
    return serverErrorResponse("Configuration error");
  }

  try {
    if (method === "POST") {
      const path = event.path;
      if (path.endsWith('/login')) {
        return await handleLogin(event.body);
      } else if (path.endsWith('/signout')) {
        return await handleSignout(event.body);
      }
      return badRequestResponse("Invalid endpoint. Use /login or /signout");
    }

    return methodNotAllowedResponse(["POST", "OPTIONS"]);
  } catch (error) {
    console.error("Unhandled error:", error);
    return serverErrorResponse("Internal server error");
  }
};

/**
 * Handle POST request for user login
 */
async function handleLogin(body: string | null) {
  try {
    const payload = parseJsonBody(body);
    const { username, password } = payload;

    if (!username || !password) {
      return badRequestResponse("Missing required fields: username and password");
    }

    // Attempt to authenticate user
    try {
      const authCommand = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const authResult = await cognitoClient.send(authCommand);
      
      if (!authResult.AuthenticationResult?.AccessToken) {
        return badRequestResponse("Invalid credentials");
      }

      // Get user attributes to determine simulation level
      const getUserCommand = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
      });

      const userResult = await cognitoClient.send(getUserCommand);
      
      // Find currentCompletedStep attribute
      const currentStepAttr = userResult.UserAttributes?.find(
        attr => attr.Name === "custom:currentCompletedStep"
      );
      
      const currentStep = currentStepAttr?.Value || "simulation-tutorial";
      
      // Determine simulation level based on current step
      let simulationLevel: number = 1; // Default value
      let canLogin = true;
      let errorMessage = "";
      
      switch (currentStep) {
        case "simulation-tutorial":
          simulationLevel = 1;
          break;
        case "level-1-simulation":
          simulationLevel = 2;
          break;
        case "level-2-simulation":
          simulationLevel = 3;
          break;
        case "level-3-simulation":
        case "post-survey":
          canLogin = false;
          errorMessage = "You have completed all simulations. Please head to post survey.";
          break;
        default:
          simulationLevel = 1;
      }
      
      if (!canLogin) {
        return createResponse(HTTP_STATUS.FORBIDDEN, {
          error: errorMessage,
        });
      }

      // Return successful login response
      return createResponse(HTTP_STATUS.OK, {
        message: "Login successful",
        userID: userResult.Username,
        simulationLevel: simulationLevel,
      });

    } catch (authError: any) {
      console.error("Authentication error:", authError);
      
      if (authError.name === "NotAuthorizedException") {
        return badRequestResponse("Invalid username or password");
      } else if (authError.name === "UserNotConfirmedException") {
        return badRequestResponse("User account not confirmed");
      } else if (authError.name === "UserNotFoundException") {
        return badRequestResponse("User not found");
      } else {
        return serverErrorResponse("Authentication failed");
      }
    }

  } catch (error) {
    console.error("Error during login:", error);
    return serverErrorResponse("Failed to process login request");
  }
}

/**
 * Handle POST request for user signout
 */
async function handleSignout(body: string | null) {
  try {
    // Simple signout without token validation
    console.log("User signed out successfully");
    
    return createResponse(HTTP_STATUS.OK, { 
      message: "Sign out successful",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error during signout:", error);
    return serverErrorResponse("Failed to process signout request");
  }
}
