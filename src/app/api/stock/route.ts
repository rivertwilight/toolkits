import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const symbol = searchParams.get("symbol");

	if (!symbol || typeof symbol !== "string") {
		return NextResponse.json(
			{ error: "Stock symbol is required" },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(
			`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
		);
		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch stock data" },
			{ status: 500 }
		);
	}
}
