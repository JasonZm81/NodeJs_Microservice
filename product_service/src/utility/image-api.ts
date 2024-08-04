import { S3 } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuid } from "uuid";
const S3Client = new S3();

// lambda handler function    
export const handler = async (
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    // grab fileName frm queryString
    
    //give unique name of that file

    //create S3Params

    //get Signed URL 

    // give it bck to client for upload iamge

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello from deals service.",
            path: `${event.path}, ${event.pathParameters}`
        })
    };
};