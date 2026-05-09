'use server';
/**
 * @fileOverview A Genkit flow for real-time object detection with spatial data.
 *
 * - detectAndAnnounceObjects - Returns objects with names, confidence, and bounding boxes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ObjectDetectionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the scene, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ObjectDetectionInput = z.infer<typeof ObjectDetectionInputSchema>;

const BoundingBoxSchema = z.object({
  x: z.number().describe('The normalized X coordinate of the center (0 to 1).'),
  y: z.number().describe('The normalized Y coordinate of the center (0 to 1).'),
  width: z.number().describe('The normalized width of the object (0 to 1).'),
  height: z.number().describe('The normalized height of the object (0 to 1).'),
});

const DetectedObjectSchema = z.object({
  name: z.string().describe('The name of the detected object (e.g., "Door", "Person", "Wall").'),
  confidence: z.number().min(0).max(1).describe('The confidence score of the detection.'),
  boundingBox: BoundingBoxSchema.describe('Spatial coordinates of the object.'),
});

const ObjectDetectionOutputSchema = z.object({
  detectedObjects: z.array(DetectedObjectSchema).describe('A list of detected objects with spatial coordinates.'),
});
export type ObjectDetectionOutput = z.infer<typeof ObjectDetectionOutputSchema>;

export async function detectAndAnnounceObjects(input: ObjectDetectionInput): Promise<ObjectDetectionOutput> {
  return objectDetectionFlow(input);
}

const objectDetectionPrompt = ai.definePrompt({
  name: 'objectDetectionPrompt',
  input: {schema: ObjectDetectionInputSchema},
  output: {schema: ObjectDetectionOutputSchema},
  prompt: `You are an expert mobility assistant for the visually impaired. 
Identify distinct objects in the image, focusing on potential obstacles or exits.
For each object, provide its name (specifically identify "Door" as "Exit" if it looks like an opening), confidence score, and a normalized bounding box (x, y, width, height where 0,0 is top-left).

Image: {{media url=imageDataUri}}`,
});

const objectDetectionFlow = ai.defineFlow(
  {
    name: 'objectDetectionFlow',
    inputSchema: ObjectDetectionInputSchema,
    outputSchema: ObjectDetectionOutputSchema,
  },
  async input => {
    const {output} = await objectDetectionPrompt(input);

    if (!output || !output.detectedObjects) {
      return { detectedObjects: [] };
    }

    // Filter high confidence objects
    const filteredObjects = output.detectedObjects.filter(
      (obj) => obj.confidence > 0.55
    );

    return { detectedObjects: filteredObjects };
  }
);
