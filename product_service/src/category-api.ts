import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utility/response";

import "./utility";
import { CategoryRepository } from "./repository/category-repository";
import { CategoryService } from "./service/category-service";
import bodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";

const service = new CategoryService(new CategoryRepository())

// lambda handler function
export const handler = middy((
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const isRoot = event.pathParameters === null;
  // /product
  // pathParameters: null

  // /product/1234
  // pathParameters: { id: 1234 }

  // use switch to determine root endpoint or sub endpoint
  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        return service.createCategory(event);

      }
      break;
    case "get":
    return isRoot ? service.getCategories(event) : service.getCategory(event);

    case "put":
      if (!isRoot) {
        return service.editCategory(event);
      }
    case "delete":
      if (!isRoot) {
        return service.deleteCategory(event);    
      }
  }
  return service.ResponseWithError(event);
}).use(bodyParser());

/*
    // carry out lambda function:
    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(`Context: ${JSON.stringify(context)}`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello from product service.",
            path: `${event.path}, ${event.pathParameters}`
        })
    };
*/
