import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

async function run() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const imgData = fs.readFileSync("./src/assets/images/misa_table.png");
  const base64Img = imgData.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Explain very clearly and in detail the visual appearance of the tables (bàn) in the restaurant layout (sơ đồ bàn) shown in this image. " +
                  "Describe specifically: " +
                  "1. What shape are they? " +
                  "2. What are the EXACT background colors or gradient values (or descriptions of colors: e.g., green, white, gray, orange, blue) for vacant (trống), serving (đang phục vụ), reserved (đặt trước), etc.? " +
                  "3. What text is inside the table? (E.g., Table number, number of seats, total price, order status?) " +
                  "4. Are there chairs around the table? How many? What shape or visual elements are used for chairs, and how are they styled in each state? " +
                  "5. Describe the borders, icons, shadows, badges, or tiny indicator lines shown on the table or chairs. " +
                  "Please write your analysis in Vietnamese or English so I can implement it perfectly in Tailwind CSS."
          },
          {
            inlineData: {
              data: base64Img,
              mimeType: "image/png"
            }
          }
        ]
      }
    ]
  });

  console.log("=== GEMINI ANALYSIS ===");
  console.log(response.text);
  console.log("=======================");
}

run().catch(console.error);
