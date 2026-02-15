"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Text from "@/components/i18n";
import { isWeb } from "@/utils/platform";
import { useColorMode } from "@/contexts/colorMode";
import { Preferences } from "@capacitor/preferences";
import MainSection from "@/components/MainSection";
import { useLocale } from "@/contexts/locale";
import { usePageTitle } from "@/utils/Hooks/usePageTitle";

export default function SettingsClient({
	currentPage,
}: {
	currentPage: any;
}) {
	const [language, setLanguage] = useState("auto");
	const { mode, setMode } = useColorMode();
	const { locale: activeLocale } = useLocale();

	usePageTitle(currentPage.title);

	const handleLanguageChange = async (event: SelectChangeEvent) => {
		const newLocale = event.target.value as string;
		setLanguage(newLocale);
		await Preferences.set({
			key: "locale",
			value: newLocale,
		});

		if (isWeb()) {
			const targetPath = `${window.location.origin}/${
				newLocale === "auto" ? "" : newLocale
			}/settings`;
			window.location.href = targetPath;
		} else {
			window.location.reload();
		}
	};

	const handleThemeChange = async (event: SelectChangeEvent) => {
		const newMode = event.target.value as "light" | "dark" | "system";
		setMode(newMode);
		await Preferences.set({
			key: "themeMode",
			value: newMode,
		});
	};

	useEffect(() => {
		const loadStoredPreferences = async () => {
			try {
				const { value: storedLocale } = await Preferences.get({
					key: "locale",
				});
				if (storedLocale) {
					setLanguage(storedLocale);
				}
			} catch (error) {
				console.error("Error loading stored preferences:", error);
			}
		};

		loadStoredPreferences();
	}, []);

	return (
		<MainSection>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 3,
					width: "100%",
				}}
			>
				{/* Language Setting */}
				<Box
					display={"flex"}
					sx={{
						width: "100%",
					}}
					justifyContent={"space-between"}
					alignItems={"center"}
				>
					<Typography variant="body1">
						<Text k="settings.language.title" />
					</Typography>

					<Box sx={{ flexGrow: 1 }} />

					<FormControl sx={{ width: 180 }}>
						<InputLabel id="settings-language-label">
							<Text k="settings.language.title" />
						</InputLabel>
						<Select
							labelId="settings-language-label"
							id="settings-language"
							name="language"
							value={language}
							onChange={handleLanguageChange}
							label={<Text k="settings.language.title" />}
						>
							<MenuItem value={"auto"}>
								<Text k="settings.language.auto" />
							</MenuItem>
							<MenuItem value={"zh-CN"}>
								<Text k="settings.language.zh_cn" />
							</MenuItem>
							<MenuItem value={"en-US"}>
								<Text k="settings.language.en_us" />
							</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* Theme Setting */}
				<Box
					display={"flex"}
					sx={{
						width: "100%",
					}}
					justifyContent={"space-between"}
					alignItems={"center"}
				>
					<Typography variant="body1">
						<Text k="settings.theme.title" />
					</Typography>

					<Box sx={{ flexGrow: 1 }} />

					<FormControl sx={{ width: 180 }}>
						<InputLabel id="settings-theme-label">
							<Text k="settings.theme.title" />
						</InputLabel>
						<Select
							labelId="settings-theme-label"
							id="settings-theme"
							value={mode}
							onChange={handleThemeChange}
							label={<Text k="settings.theme.title" />}
						>
							<MenuItem value="system">
								<Text k="settings.theme.system" />
							</MenuItem>
							<MenuItem value="light">
								<Text k="settings.theme.light" />
							</MenuItem>
							<MenuItem value="dark">
								<Text k="settings.theme.dark" />
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Box>
		</MainSection>
	);
}
