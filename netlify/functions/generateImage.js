const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Function started');
  
  try {
    const { prompt } = JSON.parse(event.body);
    console.log('Prompt:', prompt);
    console.log('API Key exists:', !!process.env.BRIA_API_KEY);

    const briaResponse = await fetch('https://engine.prod.bria-api.com/text-to-image/fast/2.3', {
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

    const responseData = await briaResponse.json();
    console.log('Bria API Response:', responseData);

    if (!responseData.results || !responseData.results[0] || !responseData.results[0].image_url) {
      console.error('Invalid response structure:', responseData);
      throw new Error('Invalid API response structure');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.toString()
      })
    };
  }
};
