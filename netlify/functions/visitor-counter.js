// Visitor Counter - Netlify Serverless Function
// This tracks unique visitors using a simple in-memory counter
// For production, use DynamoDB, Redis, or similar

const visitors = new Map();

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    
    // Simple visitor tracking (in production, use a database)
    if (!visitors.has(ip) || now - visitors.get(ip) > 24 * 60 * 60 * 1000) {
      visitors.set(ip, now);
    }

    const count = visitors.size;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        count,
        timestamp: new Date().toISOString(),
        message: 'Visitor count retrieved successfully',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to retrieve visitor count',
        message: error.message,
      }),
    };
  }
};
