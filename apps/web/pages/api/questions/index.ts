import { NextApiRequest, NextApiResponse } from 'next';
import { getQuestions } from '@/lib/supabase/questions';
import { supabase } from '@/lib/supabase';

// Enable CORS middleware
const allowCors = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => 
  async (req: NextApiRequest, res: NextApiResponse) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS method for CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return await handler(req, res);
  };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    const { topic, difficulty, limit = '5' } = req.query;
    console.log('Request params:', { topic, difficulty, limit });
    
    if (!topic || !difficulty) {
      console.log('Missing required parameters');
      return res.status(400).json({ 
        success: false,
        message: 'Topic and difficulty are required',
        required: ['topic', 'difficulty'],
        received: { topic, difficulty }
      });
    }

    // Verify Supabase connection
    try {
      const { data: testData, error: testError } = await supabase
        .from('questions')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('Supabase query error:', testError);
        throw testError;
      }
      console.log('Supabase connection test successful');
    } catch (testError: any) {
      console.error('Supabase connection test failed:', testError);
      throw new Error(`Supabase connection error: ${testError.message}`);
    }

    console.log('Fetching questions...');
    const questions = await getQuestions(
      topic as string,
      difficulty as string,
      parseInt(limit as string, 10)
    );
    
    console.log(`Fetched ${questions.length} questions`);
    
    if (questions.length === 0) {
      console.log('No questions found for the given criteria');
      return res.status(404).json({
        success: false,
        message: 'No questions found for the given criteria',
        params: { topic, difficulty, limit }
      });
    }

    return res.status(200).json({
      success: true,
      data: questions,
      meta: {
        count: questions.length,
        topic,
        difficulty,
        limit: parseInt(limit as string, 10)
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error?.message || 'Unknown error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error?.stack 
      })
    });
  }
}

export default allowCors(handler);