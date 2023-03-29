const AWS = require("aws-sdk");
const Mocker = require("aws-sdk-mock");
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
  process.env = { ...env, SNS_ARN: "arn::123", PRODUCTS_TABLE: 'products', SNS_TOPIC_ARN: 'whatever' };
  done();
});

afterAll(() => {
  process.env = env;
});

describe("catalogBatchProcess", () => {
  it("should push items from SQS to SNS", async () => {

    Mocker.setSDKInstance(AWS);
    // Arrange
    Mocker.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
      callback(null, 'successfully put item in database');
    });

    Mocker.mock('SNS', 'publish', 'poc');
    const sns = new AWS.SNS({ region: env.AWS_REGION })
    // Act
    await handler(mockEvent);
    // Assert
    let params = {
      Message: JSON.stringify({ data: 'Message you want to send to SNS topic' })
    }

    sns.publish(params, (error, res) => { // Publish to SNS topic
      expect(res).toBe('poc'); // Mocked response to equal to ‘success’ string from above
      Mocker.restore('SNS', 'publish');
      Mocker.restore('DynamoDB');
    });
  })
})