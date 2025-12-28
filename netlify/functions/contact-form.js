// Contact Form Handler - Netlify Serverless Function
// Uses Resend for reliable email delivery
// Get your API key at: https://resend.com

const { Resend } = require('resend');

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
    const spamKeywords = ['viagra', 'casino', 'lottery', 'bitcoin', 'crypto pump'];
    const messageText = message.toLowerCase();
    if (spamKeywords.some(keyword => messageText.includes(keyword))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message flagged as spam' }),
      };
    }

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Use your verified domain when ready
      to: ['sage@sageideas.org'],
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
      `,
    });

    console.log('Email sent successfully:', data);

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
    
    // Provide helpful error messages
    if (error.message.includes('API key')) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Email service configuration error',
          details: 'Please check RESEND_API_KEY environment variable',
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send message',
        message: 'Please try again or email directly at sage@sageideas.org',
      }),
    };
  }
};
