import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OPENAI_API_KEY not found in environment variables!");
  console.error("Please check your .env file contains: OPENAI_API_KEY=your_key_here");
  process.exit(1);
}

const client = new OpenAI({ 
  apiKey: apiKey 
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function chat() {
  rl.question("Ti: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for gambling recovery support. Provide supportive, encouraging responses in Serbian language."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      console.log("Bot:", completion.choices[0].message.content);
      console.log("Potrošeni tokeni:", completion.usage);
      chat();
    } catch (error) {
      console.error("Greška:", error.message);
      chat();
    }
  });
}

console.log("Chatbot za podršku u oporavku od kockanja");
console.log("Unesite 'exit' za izlazak");
console.log("-------------------");
chat();
