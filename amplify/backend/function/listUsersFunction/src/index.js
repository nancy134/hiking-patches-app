/* Amplify Params - DO NOT EDIT
	AUTH_HIKINGPATCHESAPP368A1661_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const userPoolId = process.env.AUTH_HIKINGPATCHESAPP368A1661_USERPOOLID; // Replace with your actual value

  try {
    const users = await cognito.listUsers({
      UserPoolId: userPoolId,
      Limit: 25, // Adjust as needed
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(users.Users),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

