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
  S3Client, 
  GetObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const APP_NAME = process.env.APP_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const method = event.httpMethod;

  // Handle OPTIONS requests for CORS
  if (method === "OPTIONS") {
    return optionsResponse();
  }

  // Validate environment variables
  if (!BUCKET_NAME) {
    console.error("S3_BUCKET_NAME environment variable is not set");
    return serverErrorResponse("Configuration error");
  }

  try {
    if (method === "POST") {
      return await handleGetDownloadUrl(event.body);
    }

    return methodNotAllowedResponse(["POST", "OPTIONS"]);
  } catch (error) {
    console.error("Unhandled error:", error);
    return serverErrorResponse("Internal server error");
  }
};

/**
 * Handle POST request to get download URL
 */
async function handleGetDownloadUrl(body: string | null) {
  try {
    const payload = parseJsonBody(body);
    const { os } = payload;

    if (!os) {
      return badRequestResponse("Missing required field: os");
    }

    if (!['windows', 'mac'].includes(os)) {
      return badRequestResponse("Invalid operating system. Must be 'windows' or 'mac'");
    }

    try {
      // Determine S3 key based on operating system
      const s3Key = os === 'windows' ? `win-app/${APP_NAME}` : `mac-app/${APP_NAME}`;
      
      // Create GetObject command with download headers
      const getObjectCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        ResponseContentDisposition: `attachment; filename="${APP_NAME}"`,
        ResponseContentType: 'application/octet-stream'
      });

      // Generate pre-signed URL (expires in 1 hour)
      const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, { 
        expiresIn: 3600 
      });

      console.log(`Generated download URL for ${os}: ${presignedUrl}`);

      return createResponse(HTTP_STATUS.OK, {
        message: `Download URL generated for ${os}`,
        downloadUrl: presignedUrl,
      });

    } catch (s3Error: any) {
      console.error("S3 error:", s3Error);
      
      if (s3Error.name === "NoSuchBucket") {
        return serverErrorResponse("S3 bucket not found");
      } else if (s3Error.name === "NoSuchKey") {
        return serverErrorResponse("Application file not found for this operating system");
      } else {
        return serverErrorResponse("Failed to generate download URL");
      }
    }

  } catch (error) {
    console.error("Error generating download URL:", error);
    return serverErrorResponse("Failed to process download URL request");
  }
}
