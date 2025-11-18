import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import mime from "mime";

interface RequestPayload {
	text: string;
	voiceName?: string;
	apiKey: string;
}

interface WavConversionOptions {
	numChannels: number;
	sampleRate: number;
	bitsPerSample: number;
}

function parseMimeType(mimeType: string): WavConversionOptions {
	const [fileType, ...params] = mimeType.split(";").map((s) => s.trim());
	const [_, format] = fileType.split("/");

	const options: Partial<WavConversionOptions> = {
		numChannels: 1,
	};

	if (format && format.startsWith("L")) {
		const bits = parseInt(format.slice(1), 10);
		if (!isNaN(bits)) {
			options.bitsPerSample = bits;
		}
	}

	for (const param of params) {
		const [key, value] = param.split("=").map((s) => s.trim());
		if (key === "rate") {
			options.sampleRate = parseInt(value, 10);
		}
	}

	return options as WavConversionOptions;
}

function createWavHeader(
	dataLength: number,
	options: WavConversionOptions
): Buffer {
	const { numChannels, sampleRate, bitsPerSample } = options;

	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
	const blockAlign = (numChannels * bitsPerSample) / 8;
	const buffer = Buffer.alloc(44);

	buffer.write("RIFF", 0); // ChunkID
	buffer.writeUInt32LE(36 + dataLength, 4); // ChunkSize
	buffer.write("WAVE", 8); // Format
	buffer.write("fmt ", 12); // Subchunk1ID
	buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
	buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
	buffer.writeUInt16LE(numChannels, 22); // NumChannels
	buffer.writeUInt32LE(sampleRate, 24); // SampleRate
	buffer.writeUInt32LE(byteRate, 28); // ByteRate
	buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
	buffer.writeUInt16LE(bitsPerSample, 34); // BitsPerSample
	buffer.write("data", 36); // Subchunk2ID
	buffer.writeUInt32LE(dataLength, 40); // Subchunk2Size

	return buffer;
}

function convertToWav(rawData: string, mimeType: string): Buffer {
	const options = parseMimeType(mimeType);
	const wavHeader = createWavHeader(rawData.length, options);
	const buffer = Buffer.from(rawData, "base64");

	return Buffer.concat([wavHeader, buffer]);
}

export async function POST(request: NextRequest) {
	try {
		const { text, voiceName = "Leda", apiKey } =
			(await request.json()) as RequestPayload;

		if (!text) {
			return NextResponse.json(
				{ error: "Text is required" },
				{ status: 400 }
			);
		}

		const ai = new GoogleGenAI({
			apiKey,
		});

		const config = {
			temperature: 1,
			responseModalities: ["audio"],
			speechConfig: {
				voiceConfig: {
					prebuiltVoiceConfig: {
						voiceName,
					},
				},
			},
		};

		const response = await ai.models.generateContentStream({
			model: "gemini-2.5-flash-preview-tts",
			config,
			contents: [
				{
					role: "user",
					parts: [{ text }],
				},
			],
		});

		let audioBuffer: Buffer | null = null;
		let mimeType: string | undefined;

		for await (const chunk of response) {
			if (!chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
				continue;
			}

			const inlineData = chunk.candidates[0].content.parts[0].inlineData;
			if (!inlineData.data || !inlineData.mimeType) {
				continue;
			}

			mimeType = inlineData.mimeType;
			const fileExtension = mime.getExtension(mimeType) || "wav";

			if (fileExtension === "wav") {
				audioBuffer = convertToWav(inlineData.data, mimeType);
			} else {
				audioBuffer = Buffer.from(inlineData.data, "base64");
			}
		}

		if (!audioBuffer) {
			throw new Error("Failed to generate audio data");
		}

		return new NextResponse(audioBuffer, {
			status: 200,
			headers: {
				"Content-Type": "audio/wav",
				"Content-Disposition": 'attachment; filename="audio.wav"',
			},
		});
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
