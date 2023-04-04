const generatePolicyDocument = (effect, resource) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: [resource],
    },
  ],
});

const generateResponse = (principalId, effect, resource) => ({
  principalId,
  policyDocument: generatePolicyDocument(effect, resource),
});

export const handler = (event, context, callback) => {
  const { authorizationToken, methodArn } = event;

  const authToken = authorizationToken?.split('Basic ')[1];

  if (!authToken) {
    console.log('ERROR')
    return callback(null, generateResponse('Foo', 'Deny', methodArn));
  }

  const decodedToken = Buffer.from(authToken, 'base64').toString();
  const [user, password] = decodedToken.split(':');

  if (process.env[user] !== password) {
    console.log('ERROR')
    return callback(null, generateResponse('Foo', 'Deny', methodArn));
  }

  console.log('SUCCESS', JSON.stringify(generateResponse('test', 'Allow', methodArn), null, 2))
  return callback(null, generateResponse('Foo', 'Allow', methodArn));
};