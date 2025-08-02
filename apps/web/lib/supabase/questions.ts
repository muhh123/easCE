import { supabase } from '../supabase'

export interface Question {
  id: string
  topic: string
  difficulty: string
  question: string
  options: string[]
  answer: number
  explanation: string
  created_at?: string
  updated_at?: string
}

export async function getQuestions(
  topic: string,
  difficulty: string,
  limit: number = 5
): Promise<Question[]> {
  console.log(`Fetching ${limit} ${difficulty} questions for topic: ${topic}`)
  
  try {
    // First, get all matching question IDs
    const { data: questionIds, error: idError } = await supabase
      .from('questions')
      .select('id')
      .eq('topic', topic.toLowerCase())
      .eq('difficulty', difficulty.toLowerCase())
    
    if (idError) throw idError;
    
    if (!questionIds || questionIds.length === 0) {
      console.log('No questions found for the given criteria');
      return [];
    }
    
    // Shuffle the IDs and pick the requested number
    const shuffledIds = [...questionIds].sort(() => 0.5 - Math.random());
    const selectedIds = shuffledIds.slice(0, limit).map(q => q.id);
    
    // Fetch the full question data for selected IDs
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .in('id', selectedIds)

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    console.log(`Found ${data?.length || 0} questions`)
    
    // Validate the response data
    const questions = Array.isArray(data) ? data : []
    const validQuestions = questions.filter(q => 
      q.id && q.question && Array.isArray(q.options) && q.options.length > 0 &&
      Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length
    )

    if (validQuestions.length !== questions.length) {
      console.warn(`Filtered out ${questions.length - validQuestions.length} invalid questions`)
    }

    return validQuestions
  } catch (error) {
    console.error('Error fetching questions:', error)
    return []
  }
}