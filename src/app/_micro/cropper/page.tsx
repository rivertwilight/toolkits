import { Metadata } from "next";
import CropperClient from "./page-client";
import translator from "@/utils/translator";
import { defaultLocale } from "../../../site.config";

export async function generateMetadata(): Promise<Metadata> {
	const dic = require("../../../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	return {
		title: trans.use(""),
		description: trans.use(""),
	};
}

export default function CropperPage() {
	const dic = require("../../../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	const currentPage = {
		title: trans.use(""),
		description: trans.use(""),
		path: "/_micro/cropper",
	};

	return (
		<CropperClient
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
			locale={defaultLocale}
		/>
	);
}
