import type { APIGatewayProxyHandler } from "aws-lambda";
import { 
  createResponse, 
  optionsResponse, 
  badRequestResponse, 
  notFoundResponse, 
  methodNotAllowedResponse, 
  serverErrorResponse,
  parseJsonBody,
  getQueryParams,
  HTTP_STATUS,
  createDynamoDbClient, 
  getItem, 
  putItem,
  prepareItemForStorage 
} from "../shared";

// Initialize DynamoDB client
const dynamo = createDynamoDbClient();
const CHAT_HISTORY_TABLE = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const method = event.httpMethod;
  const queryParams = getQueryParams(event.queryStringParameters);

  // Handle OPTIONS requests for CORS
  if (method === "OPTIONS") {
    return optionsResponse();
  }

  // Validate table name environment variable
  if (!CHAT_HISTORY_TABLE) {
    console.error("TABLE_NAME environment variable is not set");
    return serverErrorResponse("Configuration error");
  }

  try {
    if (method === "GET") {
      return await handleGetChatHistory(queryParams);
    }
    
    if (method === "POST") {
      return await handleSaveChatHistory(event.body);
    }

    return methodNotAllowedResponse(["GET", "POST", "OPTIONS"]);
  } catch (error) {
    console.error("Unhandled error:", error);
    return serverErrorResponse("Internal server error");
  }
};

/**
 * Handle GET request to retrieve chat history
 */
async function handleGetChatHistory(queryParams: Record<string, string>) {
  const userId = queryParams.userID;
  const simulationLevel = queryParams.simulationLevel;
  
  if (!userId) {
    return badRequestResponse("Missing query parameter: userID");
  }

  try {
    if (simulationLevel) {
      // Get specific simulation level chat history
      const item = await getItem(CHAT_HISTORY_TABLE, { 
        userID: userId, 
        simulationLevel: parseInt(simulationLevel) 
      }, dynamo);
      
      if (!item) {
        return notFoundResponse("Chat history not found for this user and simulation level");
      }

      return createResponse(HTTP_STATUS.OK, item);
    } else {
      // Get all chat history for user (would need a different query approach)
      // For now, return error suggesting to specify simulation level
      return badRequestResponse("Please specify simulationLevel parameter");
    }
  } catch (error) {
    console.error("Error getting chat history:", error);
    return serverErrorResponse("Failed to retrieve chat history");
  }
}

/**
 * Handle POST request to save new chat history
 */
async function handleSaveChatHistory(body: string | null) {
  try {
    const payload = parseJsonBody(body);
    const { userID: userId, simulationLevel, chatHistory } = payload;

    if (!userId || !simulationLevel || !chatHistory) {
      return badRequestResponse("Missing required fields: userID, simulationLevel, and chatHistory");
    }

    if (![1, 2, 3].includes(simulationLevel)) {
      return badRequestResponse("simulationLevel must be 1, 2, or 3");
    }

    // Prepare item for storage with composite key
    const item = prepareItemForStorage(
      { 
        simulationLevel,
        chatHistory 
      },
      userId,
      false // Don't include generated ID, use composite key
    );

    // Add composite key for userID + simulationLevel
    item.userID = userId;
    item.simulationLevel = simulationLevel;

    await putItem(CHAT_HISTORY_TABLE, item, dynamo);

    console.log("Chat history saved successfully");
    console.log("CHAT HISTORY DATA", item);
    return createResponse(HTTP_STATUS.OK, { 
      message: "Chat history saved successfully",
      timestamp: item.timestamp
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
    
    if (error instanceof Error && error.message.includes("Invalid")) {
      return badRequestResponse(error.message);
    }
    
    return serverErrorResponse("Failed to save chat history");
  }
}
