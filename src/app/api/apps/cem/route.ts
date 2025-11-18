import { NextRequest, NextResponse } from "next/server";
import cem from "@/apps/cem/dic";

export async function POST(request: NextRequest) {
	try {
		const { rawStr, htmlMark } = await request.json();

		console.log(rawStr);

		if (!!!rawStr) {
			return NextResponse.json(
				{ message: "No string provided." },
				{ status: 403 }
			);
		}

		const response = cem(rawStr, htmlMark).resultRaw;

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: error.message },
			{ status: 500 }
		);
	}
}
