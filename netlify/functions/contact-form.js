// Contact Form Handler - Netlify Serverless Function
// Handles form submissions with validation and email notifications
// For production, integrate with SendGrid, AWS SES, or similar

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['name', 'email', 'message'],
        }),
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Spam protection: basic checks
    const spamKeywords = ['viagra', 'casino', 'lottery', 'bitcoin'];
    const messageText = message.toLowerCase();
    if (spamKeywords.some(keyword => messageText.includes(keyword))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message flagged as spam' }),
      };
    }

    // TODO: In production, send email via SendGrid, AWS SES, etc.
    // For now, just log and return success
    console.log('Contact form submission:', { name, email, message: message.substring(0, 50) + '...' });

    // You would integrate email sending here:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ ... });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for reaching out! I\'ll get back to you soon.',
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process form submission',
        message: error.message,
      }),
    };
  }
};
