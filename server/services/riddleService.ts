import { storage } from '../storage';
import { generateRiddle } from './openai';
import { InsertRiddle } from '@shared/schema';

export async function createDailyRiddle(): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate a new riddle from OpenAI
    const { question, answer } = await generateRiddle();
    
    // Create a new riddle in the storage
    const newRiddle: InsertRiddle = {
      question,
      answer,
      isLatest: true, // Mark as the latest riddle
    };
    
    await storage.createRiddle(newRiddle);
    return { success: true };
  } catch (error) {
    console.error('Error creating daily riddle:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

export async function getLatestRiddle() {
  return storage.getLatestRiddle();
}

export async function getRiddles(limit?: number, offset?: number) {
  return storage.getRiddles(limit, offset);
}

export async function getRiddleCount() {
  return storage.countRiddles();
}
