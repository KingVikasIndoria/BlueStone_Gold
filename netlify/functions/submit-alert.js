const { google } = require('googleapis')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { phone, name, budget, alertType, city } = body

    if (!phone || !name || !budget) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) }
    }

    const requiredEnv = [
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_SHEET_ID',
    ]
    const missingEnv = requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === '')
    if (missingEnv.length > 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: `Server misconfigured: missing env vars ${missingEnv.join(', ')}`,
        }),
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    const timestamp = new Date().toISOString()
    const rowData = [
      timestamp,
      phone,
      name,
      budget,
      alertType || 'price_drop',
      city || 'Chennai',
      'Active',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Alerts!A:G',
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rowData] },
    })

    return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Alert submitted successfully!' }) }
  } catch (error) {
    console.error('Error submitting alert:', error)
    return { statusCode: 500, body: JSON.stringify({ success: false, message: `Failed to submit alert: ${error?.message || 'Unknown error'}` }) }
  }
}

const { google } = require('googleapis');

exports.handler = async function (event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const requiredEnv = [
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_SHEET_ID',
    ];
    const missing = requiredEnv.filter((k) => !process.env[k] || process.env[k].trim() === '');
    if (missing.length) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: `Missing env vars: ${missing.join(', ')}` }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { phone, name, budget, alertType, city } = body;

    if (!phone || !name || !budget) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: 'Missing required fields' }),
      };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      phone,
      name,
      budget,
      alertType || 'price_drop',
      city || 'Chennai',
      'Active',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Alerts!A:G',
      valueInputOption: 'USER_ENTERED',
      resource: { values: [row] },
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Alert submitted successfully!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, message: err.message || 'Unknown error' }),
    };
  }
};
