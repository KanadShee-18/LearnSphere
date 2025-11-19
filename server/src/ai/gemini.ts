import { GoogleGenAI } from "@google/genai";
import type { Request, Response } from "express";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export const aiContent = async (req: Request, res: Response) => {
  try {
    const { courseName } = await req.body;
    if (!courseName) {
      return res.status(401).json({
        success: false,
        message: "Course Name is required to generate content.",
      });
    }

    const prompt = `
      Generate full course content for a new online course.

      Course Title: ${courseName}

      Return a JSON object with EXACTLY these keys:
      - title: a crisp clear title for the course (5-6 words)
      - description: a clear course description (50-60 words)
      - learning: an array of 5-7 bullet points of what students will learn
      - tags: an array of 5 short tags (single or double word only)
      - instructions: an array of 4-6 short instructor instructions

      Format response ONLY as JSON. No explanation.
    `;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (error: any) {
      if (error?.code === 503) {
        console.warn("Flash overloaded! Using lite instead: ", error);
        response = await ai.models.generateContent({
          model: "gemini-2.0-flash-lite",
          contents: prompt,
        });
      }
    }
    let text;
    if (response && response.text) {
      text = response.text.replace(/```json|```/g, "").trim();
    }
    let data;

    if (text) {
      try {
        data = JSON.parse(text);
        res.status(200).json({
          success: true,
          message: "Content generated successfully!",
          data: data ?? null,
        });
        return;
      } catch (error) {
        res.status(500).json({
          success: true,
          error: "Some error occurred while generating content!",
        });
        return;
      }
    }
  } catch (error) {
    console.error("Error in generating ai content: ", error);
    return res.status(500).json({
      success: true,
      error: "Some error occurred while generating content!",
    });
  }
};
