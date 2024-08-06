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
    const file = event.queryStringParameters?.file;
    //give unique name of that file
    const fileName = `${uuid()}__${file}`;

    //create S3Params
    const S3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        ContentType: "image/jpeg"
    };
    //get Signed URL 
    const url = await S3Client.getSignedUrlPromise("putObject", S3Params);

    console.log("UPLOAD URL:", S3Params, url);

    // give it bck to client for upload iamge
    return {
        statusCode: 200,
        body: JSON.stringify({
            url,
            Key: fileName
        })
    };
};