import { NextResponse } from "next/server";
import { getAllApps } from "@/utils/appData.server";

export async function GET() {
	const appData = getAllApps(true);
	return NextResponse.json(appData);
}
