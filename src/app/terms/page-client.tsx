"use client";

import React, { useEffect, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StyledMarkdown from "@/components/StyledMarkdown";
import { useAction } from "@/contexts/action";
import { useLocale } from "@/contexts/locale";
import Layout from "@/components/Layout";
import Text from "@/components/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { store as frameStore } from "@/utils/Data/frameState";

export default function TermsClient({
	currentPage,
	dic,
	locale,
}: {
	currentPage: any;
	dic: string;
	locale: string;
}) {
	const { locale: activeLocale } = useLocale();
	const { setAction } = useAction();
	const [content, setContent] = useState("");
	const [framed, setFramed] = useState<Boolean>(true);

	useEffect(() => {
		setAction(null);
	}, [setAction]);

	useEffect(() => {
		const unsubscribe = frameStore.subscribe(() =>
			setFramed(frameStore.getState().value)
		);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		fetch(`/data/article/${activeLocale}/terms.md`)
			.then((res) => res.text())
			.then((res) => {
				setContent(res);
			});
	}, [activeLocale]);

	const localizedDic = useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<Text dictionary={localizedDic || {}} language={activeLocale}>
			<Layout appData={[]} currentPage={currentPage} enableFrame={framed}>
				<Card style={{ maxWidth: "800px" }}>
					<CardContent>
						<StyledMarkdown content={content} />
					</CardContent>
				</Card>
			</Layout>
			{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
				<GoogleAnalytics
					ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
				/>
			)}
		</Text>
	);
}
