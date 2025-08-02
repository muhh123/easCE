import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    console.log('Testing Supabase connection...');
    
    // Test connection by fetching a single question
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error connecting to Supabase',
        error: error.message
      });
    }

    console.log('Successfully connected to Supabase');
    
    return res.status(200).json({
      success: true,
      message: 'Successfully connected to Supabase',
      data: data || [],
      hasQuestions: data && data.length > 0
    });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error?.message || 'Unknown error'
    });
  }
}
