// netlify/functions/logUrlParams.js

exports.handler = async (event) => {
  const queryParams = event.queryStringParameters; // Capture URL params
  console.log("Query String Parameters:", queryParams); // Log them to Netlify's function logs

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Logged URL parameters!" }),
  };
};
