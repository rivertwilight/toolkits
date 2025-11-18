// This file appears to be empty in the pages router
// Keeping it as a placeholder for future implementation
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	return NextResponse.json(
		{ message: "Webpage clipper endpoint - not implemented" },
		{ status: 501 }
	);
}
