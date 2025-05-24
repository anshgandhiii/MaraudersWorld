import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const masterPrompt = `Look at the image and extract relevant text info from the image. Return a JSON object for the following classes: construction, some label or text in the image, some crime being committed (should be titled as "crime") in the image or any distinct category. The JSON should be formatted in the following manner:

{
  "title": "construction/crime/<any label>",
  "description": "some description",
  "color": "color based on title"
}

the purpose is to update map data in real time. create title, description and color accordingly
Please return only valid JSON without any additional text or markdown formatting.`;

export async function analyzeBase64Image(base64Image) {
  let apiKey = process.env.GEMINI_API_KEY

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent([
      masterPrompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = (await result.response).text();
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      throw new Error("Response is not valid JSON: " + cleaned);
    }
  } catch (error) {
    throw new Error("Failed to analyze image: " + error.message);
  }
}

// import fs from "fs";
// import path from "path";

// const imagePath = path.resolve("./label.jpg");

// (async () => {
// try {
// const imageBuffer = fs.readFileSync(imagePath);
// const base64Image = imageBuffer.toString("base64");
// const result = await analyzeBase64Image(base64Image);
// console.log("Result:", result);
// } catch (error) {
// console.error("Error:", error.message);
// }
// })();