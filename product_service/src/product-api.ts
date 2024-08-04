import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utility/response";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";
import "./utility";

const service = new ProductService(new ProductRepository())

// lambda handler function
export const handler = async (
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
        return service.createProduct(event);

      }
      break;
    case "get":
    return isRoot ? service.getProducts(event) : service.getProduct(event);

    case "put":
      if (!isRoot) {
        return service.editProduct(event);
      }
    case "delete":
      if (!isRoot) {
        return service.deleteProduct(event);    
      }
  }
  return ErrorResponse(404, "requested method not allowed!");
};

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
