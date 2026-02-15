import { Metadata } from "next";
import FeedbackClient from "./page-client";
import translator from "@/utils/translator";
import { defaultLocale } from "../../../site.config";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "反馈",
	};
}

export default function FeedbackPage() {
	const currentPage = {
		title: "反馈",
		path: "/feedback",
	};

	return <FeedbackClient currentPage={currentPage} />;
}
