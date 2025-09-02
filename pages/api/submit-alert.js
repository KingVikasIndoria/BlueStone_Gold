import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { phone, name, budget, alertType, city } = req.body;

    // Validate required fields
    if (!phone || !name || !budget) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate required environment variables
    const requiredEnv = [
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_SHEET_ID'
    ];
    const missingEnv = requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === '');
    if (missingEnv.length > 0) {
      return res.status(500).json({
        success: false,
        message: `Server misconfigured: missing env vars ${missingEnv.join(', ')}`,
      });
    }

    // Google Sheets configuration
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
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Prepare row data
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      phone,
      name,
      budget,
      alertType || 'price_drop',
      city || 'Chennai',
      'Active'
    ];

    // Append to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Alerts!A:G', // Assumes sheet named "Alerts" with columns A-G
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });

    res.status(200).json({ 
      success: true, 
      message: 'Alert submitted successfully!' 
    });

  } catch (error) {
    console.error('Error submitting alert:', error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to submit alert: ${error?.message || 'Unknown error'}` 
    });
  }
}
