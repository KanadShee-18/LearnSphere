import type { Request, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import { HUGGING_FACE_API_ENDPOINT } from "../utils/endpoint.js";
import "dotenv/config";

export const generateAIthumbnail = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    console.log("Prompt is passing as: ", prompt);

    if (!prompt || prompt.trim().length === 0) {
      res.status(403).json({
        success: false,
        message: "Prompt is required to generate image!",
      });
      return;
    }

    const response = await fetch(
      `${HUGGING_FACE_API_ENDPOINT}/models/black-forest-labs/FLUX.1-dev`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            height: 720,
            width: 1280,
            num_inference_steps: 50,
            guidance_scale: 5.0,
          },
        }),
      }
    );

    console.log("Response from hugging face: ", response);

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Error while generating image",
      });
    }
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    return res.status(200).json({
      success: true,
      message: "Thumbnail has been generated!",
      data: {
        image_buffer: base64Image,
      },
    });
  } catch (error) {
    console.error("Error coming as: ", error);

    return res.status(500).json({
      success: false,
      error: "Some error occurred in server to generate thumbnail!",
    });
  }
};
