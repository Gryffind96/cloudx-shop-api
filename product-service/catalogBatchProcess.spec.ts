//const { expect, test, beforeAll, afterAll, describe } = require('@jest/globals');
const aws = require("aws-sdk");
const AWSMock = require("aws-sdk-mock");
const { handler } = require('./catalogBatchProcess');
const mockEvent = {
  Records: [
    {
      messageId: "1",
      body: JSON.stringify({
        title: "title1",
        description: "description1",
        price: 1,
        count: 1,
      }),
    },
    {
      messageId: "2",
      body: JSON.stringify({
        title: "title2",
        description: "description2",
        price: 2,
        count: 2,
      }),
    },
  ],
};

const env = process.env;

beforeAll((done) => {
  process.env = { ...env, SNS_ARN: "arn::123" };
  done();
});

afterAll(() => {
  process.env = env;
});

describe("catalogBatchProcess", () => {
  test("should push items from SQS to SNS", async () => {
    //const adpt = productsDbDynamoAdapter;

    const mockPublishToSNS = jest.fn().mockImplementation((_) => {
      console.log("SNS", "tranpublishsactWrite", "mock called");
    });
    const mockTransactWrite = jest.fn().mockImplementation((_) => {
      console.log("DynamoDB.DocumentClient", "transactWrite", "mock called");
    });
    AWSMock.setSDKInstance(aws);
    AWSMock.mock("DynamoDB.DocumentClient", "transactWrite", mockTransactWrite);
    AWSMock.mock("SNS", "publish", mockPublishToSNS);

    await handler(mockEvent);

    expect(mockTransactWrite).toBeCalled();
    expect(mockPublishToSNS).toBeCalled();
  });
});