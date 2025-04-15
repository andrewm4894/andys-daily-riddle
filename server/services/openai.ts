import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type RiddleResponse = {
  question: string;
  answer: string;
};

export async function generateRiddle(): Promise<RiddleResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a creative riddle generator. Generate an interesting, challenging but solvable riddle with its answer. Be creative and original."
        },
        {
          role: "user",
          content: "Generate a unique and interesting riddle with its answer. Respond with JSON in this format: { 'question': 'the riddle question', 'answer': 'the riddle answer' }"
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
