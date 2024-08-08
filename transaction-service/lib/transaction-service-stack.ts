import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { SubscriptionFilter, Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { join } from 'path';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TransactionServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a queue
    const orderQueue = new Queue(this, "order_queue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // getting reference frm specific sns topic  
    const orderTopic = Topic.fromTopicArn(
      this,
      "order-consume-topic",
      cdk.Fn.importValue("customer-topic")
    );

    // subscribe sns topic for tis queue
    orderTopic.addSubscription(
      new SqsSubscription(orderQueue, {
        rawMessageDelivery: true,
        filterPolicy: {
          actionType: SubscriptionFilter.stringFilter({
            allowlist: ["place_order"],
          }),
        },
      })
    );

    //create nodejs/lambda func handler
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      runtime: Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(10),
    };

    const createOrderHandler = new NodejsFunction(
      this,
      "create-order-handler",
      {
        entry: join(__dirname, "/../src/order/create.ts"),
        ...nodeJsFunctionProps,
      }
    );

    //adding event source as order
    createOrderHandler.addEventSource(new SqsEventSource(orderQueue));
  }
}
