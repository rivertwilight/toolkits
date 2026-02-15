import { Metadata } from "next";
import DonateClient from "./page-client";
import translator from "@/utils/translator";
import { defaultLocale } from "../../../site.config";

export async function generateMetadata(): Promise<Metadata> {
	const dic = require("../../../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	return {
		title: "捐赠",
		description: trans.use(""),
	};
}

export default function DonatePage() {
	const currentPage = {
		title: "捐赠",
		description: "",
		path: "/donate",
	};

	return <DonateClient currentPage={currentPage} />;
}
