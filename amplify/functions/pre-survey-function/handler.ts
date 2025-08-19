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
  stringifyNumbers, 
  parseNumbers,
  createDynamoDbClient, 
  getItem, 
  putItem,
  prepareItemForStorage 
} from "../shared";

// Initialize DynamoDB client
const dynamo = createDynamoDbClient();
const PRE_SURVEY_TABLE = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const method = event.httpMethod;
  const queryParams = getQueryParams(event.queryStringParameters);

  // Handle OPTIONS requests for CORS
  if (method === "OPTIONS") {
    return optionsResponse();
  }

  // Validate table name environment variable
  if (!PRE_SURVEY_TABLE) {
    console.error("TABLE_NAME environment variable is not set");
    return serverErrorResponse("Configuration error");
  }

  try {
    if (method === "GET") {
      return await handleGetSurvey(queryParams);
    }
    
    if (method === "POST") {
      return await handleSubmitSurvey(event.body);
    }

    return methodNotAllowedResponse(["GET", "POST", "OPTIONS"]);
  } catch (error) {
    console.error("Unhandled error:", error);
    return serverErrorResponse("Internal server error");
  }
};

/**
 * Handle GET request to retrieve survey data
 */
async function handleGetSurvey(queryParams: Record<string, string>) {
  const userId = queryParams.userID;
  
  if (!userId) {
    return badRequestResponse("Missing query parameter: userID");
  }

  try {
    const item = await getItem(PRE_SURVEY_TABLE, { userID: userId }, dynamo);
    
    if (!item) {
      return notFoundResponse("User has not submitted the pre survey");
    }

    // Convert string numbers back to numbers in the response
    const parsedItem = parseNumbers(item);
    return createResponse(HTTP_STATUS.OK, parsedItem);
  } catch (error) {
    console.error("Error getting survey:", error);
    return serverErrorResponse("Failed to retrieve survey data");
  }
}

/**
 * Handle POST request to submit survey data
 */
async function handleSubmitSurvey(body: string | null) {
  try {
    const payload = parseJsonBody(body);
    const { userID: userId, answers, ...additionalFields } = payload;

    if (!userId || !answers) {
      return badRequestResponse("Missing required fields: userID and answers");
    }

    // Check if record already exists
    const existingItem = await getItem(PRE_SURVEY_TABLE, { userID: userId }, dynamo);

    const currentTime = new Date().toISOString();

    // Convert answers to storage format
    const answersForStorage = stringifyNumbers(answers);

    // Prepare base item with required fields
    const baseItem = {
      answers: answersForStorage,
      ...additionalFields // Include any additional fields from payload
    };

    // Prepare item for storage with common fields
    const item = prepareItemForStorage(
      baseItem,
      userId,
      true // Include generated ID
    );

    if (existingItem) {
      // Record exists, update updatedAt
      item.updatedAt = currentTime;
      // Keep existing createdAt
      item.createdAt = existingItem.createdAt;
      
      // Log what additional fields are being updated
      if (Object.keys(additionalFields).length > 0) {
        console.log("Updating additional fields:", Object.keys(additionalFields));
      }
    } else {
      // New record, set both createdAt and updatedAt
      item.createdAt = currentTime;
      item.updatedAt = currentTime;
      
      // Log what additional fields are being added
      if (Object.keys(additionalFields).length > 0) {
        console.log("Adding new fields:", Object.keys(additionalFields));
      }
    }

    await putItem(PRE_SURVEY_TABLE, item, dynamo);

    console.log("Pre survey submitted successfully");
    console.log("PRE SURVEY ANSWERS", item);
    return createResponse(HTTP_STATUS.OK, { 
      message: "Pre survey submitted successfully",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      additionalFields: Object.keys(additionalFields) // Return info about what additional fields were processed
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    
    if (error instanceof Error && error.message.includes("Invalid")) {
      return badRequestResponse(error.message);
    }
    
    return serverErrorResponse("Failed to submit survey");
  }
} 