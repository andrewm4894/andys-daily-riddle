import OpenAI from "openai";
import { storage } from "../storage";
import { type Riddle } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type RiddleResponse = {
  question: string;
  answer: string;
};

export async function generateRiddle(): Promise<RiddleResponse> {
  try {
    // Get the 100 most recent riddles to avoid duplication
    const recentRiddles = await storage.getRiddles(100, 0);
    
    // Format the riddles for the prompt
    const riddlesText = recentRiddles
      .map((riddle, index) => `${index + 1}. Q: ${riddle.question}\n   A: ${riddle.answer}`)
      .join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a creative riddle generator. Generate an interesting, challenging but solvable riddle with its answer. 
          Be creative and original. Make sure your riddle is not similar to any of the riddles in the list below.
          Always include a relevant emoji at the beginning of the answer to make it more fun.
          
          RECENT RIDDLES (DO NOT DUPLICATE THESE):
          ${riddlesText}`
        },
        {
          role: "user",
          content: "Generate a unique and interesting riddle with its answer. Make sure it's not similar to any of the recent riddles I provided. Your riddle should be original, clever, and fun. Always include a relevant emoji at the beginning of the answer. Respond with JSON in this format: { 'question': 'the riddle question', 'answer': '🔍 the riddle answer' } - but choose an emoji that matches the answer content."
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.question || !result.answer) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      question: result.question,
      answer: result.answer
    };
  } catch (error) {
    console.error("Failed to generate riddle:", error);
    throw new Error("Failed to generate a riddle. Please try again later.");
  }
}
