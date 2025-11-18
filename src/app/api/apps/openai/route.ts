import { NextRequest, NextResponse } from "next/server";
import openai from "@/utils/openai";
import type { CreateCompletionRequest } from "openai";

export async function POST(request: NextRequest) {
	try {
		const { packedData } = (await request.json()) as {
			packedData: CreateCompletionRequest;
		};

		const response = await openai.createCompletion(packedData);
		console.log(response.data);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: error.message },
			{ status: 500 }
		);
	}
}
