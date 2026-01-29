"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
	Card,
	CardContent,
	Typography,
	Link,
	Divider,
	Box,
	Button,
} from "@mui/material";
import StyledMarkdown from "@/components/StyledMarkdown";
import useNotifications from "@/utils/Hooks/useNotification";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Layout from "@/components/Layout";
import Text from "@/components/i18n";

import { useLocale } from "@/contexts/locale";
import { store as frameStore } from "@/utils/Data/frameState";

export default function ChangelogClient({
	currentPage,
	dic,
	locale,
}: {
	currentPage: any;
	dic: string;
	locale: string;
}) {
	const [notifications, handleMarkAsRead] = useNotifications();
	const { locale: activeLocale } = useLocale();
	const [framed, setFramed] = useState<Boolean>(true);

	useEffect(() => {
		const unsubscribe = frameStore.subscribe(() =>
			setFramed(frameStore.getState().value)
		);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		// Mark all notifications as read when the page is opened
		notifications.forEach((notification) => {
			if (!notification.isRead) {
				handleMarkAsRead(notification.id);
			}
		});
	}, [notifications, handleMarkAsRead]);

	const localizedDic = useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<Text dictionary={localizedDic || {}} language={activeLocale}>
			<Layout appData={[]} currentPage={currentPage} enableFrame={framed}>
				<Box
					sx={{
						width: { sm: "768px", xs: "100%" },
						marginBottom: 4,
						paddingX: { sm: 0, xs: 2 },
					}}
				>
					{notifications
						.slice()
						.reverse()
						.slice(0, 5)
						.map((notification) => (
							<Card
								key={notification.id}
								id={`notification-${notification.id}`}
								sx={{
									marginBottom: 2,
									borderRadius: "24px",
									background: (theme) =>
										theme.palette.background.paper,
									boxShadow: "none",
								}}
							>
								<CardContent>
									<Typography variant="h5">
										{notification.createDate.split("T")[0]}
									</Typography>
									<Divider />
									<Box sx={{ paddingY: 2 }}>
										<StyledMarkdown
											content={notification.content}
										/>
									</Box>
								</CardContent>
							</Card>
						))}

					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Link
							href="https://github.com/RiverTwilight/ygktool/issues/21"
							target="_blank"
							rel="noopener noreferrer"
							underline="none"
						>
							<Button endIcon={<OpenInNewIcon />}>
								Check archived notification
							</Button>
						</Link>
					</Box>
				</Box>
			</Layout>

		</Text>
	);
}
