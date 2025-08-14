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
const POST_SURVEY_TABLE = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const method = event.httpMethod;
  const queryParams = getQueryParams(event.queryStringParameters);

  // Handle OPTIONS requests for CORS
  if (method === "OPTIONS") {
    return optionsResponse();
  }

  // Validate table name environment variable
  if (!POST_SURVEY_TABLE) {
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
    const item = await getItem(POST_SURVEY_TABLE, { userID: userId }, dynamo);
    
    if (!item) {
      return notFoundResponse("User has not submitted the post survey");
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
    const { userID: userId, answers } = payload;

    if (!userId || !answers) {
      return badRequestResponse("Missing required fields: userID and answers");
    }

    // Convert answers to storage format
    const answersForStorage = stringifyNumbers(answers);

    // Prepare item for storage with common fields
    const item = prepareItemForStorage(
      { answers: answersForStorage },
      userId,
      true // Include generated ID
    );

    await putItem(POST_SURVEY_TABLE, item, dynamo);

    console.log("Post survey submitted successfully");
    console.log("POST SURVEY ANSWERS", item);
    return createResponse(HTTP_STATUS.OK, { 
      message: "Post survey submitted successfully",
      timestamp: item.timestamp
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    
    if (error instanceof Error && error.message.includes("Invalid")) {
      return badRequestResponse(error.message);
    }
    
    return serverErrorResponse("Failed to submit survey");
  }
}
