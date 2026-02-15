"use client";

import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StyledMarkdown from "@/components/StyledMarkdown";
import { useLocale } from "@/contexts/locale";
import { usePageTitle } from "@/utils/Hooks/usePageTitle";

export default function TermsClient({
	currentPage,
}: {
	currentPage: any;
}) {
	const { locale: activeLocale } = useLocale();
	const [content, setContent] = useState("");

	usePageTitle(currentPage.title);

	useEffect(() => {
		fetch(`/data/article/${activeLocale}/terms.md`)
			.then((res) => res.text())
			.then((res) => {
				setContent(res);
			});
	}, [activeLocale]);

	return (
		<Card style={{ maxWidth: "800px" }}>
			<CardContent>
				<StyledMarkdown content={content} />
			</CardContent>
		</Card>
	);
}
