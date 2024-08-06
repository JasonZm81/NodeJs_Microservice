import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ServiceStack } from "./service-stack";
import { ApiGatewayStack } from "./api_gateway-stack";
import { S3BucketStack } from "./s3bucket-stack";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create bucket stack
    // destructuring obj frm S3BucketStack
    const { bucket } = new S3BucketStack(this, "productsImages");

    //create service stacks
    const { productService, categoryService, dealsService, imageService } =
      new ServiceStack(this, "ProductService", {
        //passes bucket name to ServiceStack.
        bucket: bucket.bucketName,
      });

    //assign permission
    bucket.grantReadWrite(imageService);

    new ApiGatewayStack(this, "ProductApiGateway", {
      productService,
      categoryService,
      dealsService,
      imageService,
    });
  }
}
