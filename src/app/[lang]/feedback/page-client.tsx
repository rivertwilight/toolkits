"use client";

import Button from "@mui/material/Button";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { isWeb } from "@/utils/platform";
import { Toast } from "@capacitor/toast";
import { Box, FormControlLabel, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Text from "@/components/i18n";
import MainSection from "@/components/MainSection";
import { usePageTitle } from "@/utils/Hooks/usePageTitle";

export default function FeedbackClient({
	currentPage,
}: {
	currentPage: any;
}) {
	const [feedback, setFeedback] = React.useState("");
	const [contact, setContact] = React.useState("");
	const [debugInfo, setDebugInfo] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	usePageTitle(currentPage.title);

	const handleSubmit = () => {
		if (!feedback.trim()) {
			if (isWeb()) {
				window.snackbar({ message: "请输入反馈内容！" });
			} else {
				Toast.show({
					text: "请输入反馈内容！",
				});
			}
			return;
		}

		window.showGlobalLoadingOverlay();
		setIsLoading(true);

		const feedbackData = {
			message: feedback,
			contact: contact,
			device: window.navigator.platform,
			system: window.navigator.userAgent,
			appIdentifier: "Toolkits Web",
			sourceUrl: window.location.href,
		};

		const apiUrl = isWeb()
			? "/api/feedback"
			: "https://tlkts.com/api/feedback";

		axios
			.post(apiUrl, feedbackData)
			.then(() => {
				window.snackbar({ message: "已提交反馈，感谢您的反馈！" });
			})
			.catch((error) => {
				window.snackbar({ message: "反馈提交失败，请稍后再试！" });
			})
			.finally(() => {
				window.hideGlobalLoadingOverlay();
				setIsLoading(false);
			});
	};

	const handleChange = (event) => {
		setFeedback(event.target.value);
	};

	const handleContactChange = (event) => {
		setContact(event.target.value);
	};

	return (
		<MainSection>
			<Typography
				sx={{
					fontFamily: "Product Sans",
					marginTop: 2,
				}}
				align="center"
				variant="h5"
			>
				<Text k="feedback.hero" />
			</Typography>
			<Typography
				sx={{
					marginBottom: 4,
				}}
				gutterBottom
				align="center"
				variant="body1"
			>
				<Text k="feedback.subtitle" />
			</Typography>
			<FormControl fullWidth>
				<TextField
					autoComplete="off"
					value={feedback}
					variant="outlined"
					onChange={handleChange}
					rows={6}
					required
					multiline
					label={<Text k="feedback.content.placeholder" />}
				/>
			</FormControl>
			<br />
			<br />
			<FormControl fullWidth>
				<TextField
					autoComplete="off"
					id="contact"
					value={contact}
					variant="outlined"
					onChange={handleContactChange}
					label={<Text k="feedback.contact.placeholder" />}
				/>
			</FormControl>
			<br />
			<br />
			<Box display={"flex"} alignItems={"center"} justifyContent={"end"}>
				<FormControlLabel
					control={
						<Checkbox
							checked={debugInfo}
							onChange={(_, checked) => setDebugInfo(checked)}
						/>
					}
					label={<Text k="feedback.debug" />}
				/>
				<Button
					disabled={isLoading || !feedback.trim()}
					variant="contained"
					onClick={handleSubmit}
				>
					<Text k="feedback.send" />
				</Button>
			</Box>
		</MainSection>
	);
}
