import Groq from "groq-sdk";
import type { Request, Response } from "express";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const aiContent_groq = async (req: Request, res: Response) => {
  try {
    const { courseName } = await req.body;
    if (!courseName) {
      return res.status(401).json({
        success: false,
        message: "Course Name is required to generate content.",
      });
    }

    const response = await groq.chat.completions.create({
      model: "moonshotai/kimi-k2-instruct-0905",
      messages: [
        {
          role: "system",
          content: "Generate structured course content.",
        },
        {
          role: "user",
          content: `Generate course content for: ${courseName}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "course_schema",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              learnings: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              price: {
                type: "number",
                minimum: 4000,
                maximum: 7000,
              },
              category: {
                type: "string",
                enum: [
                  "DSA",
                  "AI ML",
                  "Web Development",
                  "Python",
                  "Android Development",
                  "Blockchain",
                  "Data Science",
                  "Cloud Computing",
                  "WEB3",
                  "DevOps",
                ],
              },
              instructions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "title",
              "description",
              "learnings",
              "tags",
              "instructions",
              "category",
              "price",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course content generated successfully!",
      data: JSON.parse(response.choices[0]?.message.content || "{}"),
    });
  } catch (error) {
    console.error("Error in generating ai content: ", error);
    return res.status(500).json({
      success: true,
      error: "Some error occurred while generating content!",
    });
  }
};
