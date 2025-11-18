import { Metadata } from "next";
import AboutClient from "./page-client";
import translator from "@/utils/translator";
import { defaultLocale } from "../../../site.config";

export async function generateMetadata(): Promise<Metadata> {
	const dic = require("../../../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	return {
		title: trans.use("aboutPage.meta.title"),
		description: trans.use(""),
	};
}

export default function AboutPage() {
	const dic = require("../../../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	const currentPage = {
		title: trans.use("aboutPage.meta.title"),
		description: trans.use(""),
		path: "/about",
	};

	return (
		<AboutClient
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
			locale={defaultLocale}
		/>
	);
}
