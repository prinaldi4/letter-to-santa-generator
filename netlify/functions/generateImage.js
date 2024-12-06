const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Function started');
  
  if (event.httpMethod !== 'POST') {
    console.log('Wrong HTTP method');
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    console.log('Received prompt:', prompt);
    console.log('Using API key:', process.env.BRIA_API_KEY ? 'Key exists' : 'No key found');

    const response = await fetch('https://engine.prod.bria-api.com/text-to-image/fast/2.3', {
      method: 'POST',
      headers: {
        'api_token': process.env.BRIA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        num_results: 1,
        sync: true
      })
    });

    console.log('Bria API response status:', response.status);
    const data = await response.json();
    console.log('Bria API response:', data);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Detailed error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate image',
        details: error.message
      })
    };
  }
};
