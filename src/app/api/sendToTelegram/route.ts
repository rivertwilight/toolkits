import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json();
		const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

		if (!TELEGRAM_BOT_TOKEN) {
			return NextResponse.json(
				{ message: "TELEGRAM_BOT_TOKEN is not defined" },
				{ status: 500 }
			);
		}

		const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
		console.log(message);

		const data = {
			chat_id: TELEGRAM_CHAT_ID,
			text: message,
			parse_mode: "Markdown",
		};

		const response = await axios.post(url, data);
		console.log(response);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: error.message },
			{ status: 500 }
		);
	}
}
