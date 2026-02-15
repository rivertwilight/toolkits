"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Device } from "@capacitor/device";
import { ColorModeProvider } from "@/contexts/colorMode";
import { LocaleProvider, useLocale } from "@/contexts/locale";
import { SidebarProvider } from "@/contexts/sidebar";
import { AppBarProvider } from "@/contexts/appBar";
import { ActionProvider } from "@/contexts/action";
import { PageProvider } from "@/contexts/page";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { isWeb } from "@/utils/platform";
import { useFrameState } from "@/utils/Hooks/useFrameState";
import Header from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import GlobalSnackbar from "@/components/GlobalSnackbar";
import GlobalLoading from "@/components/GlobalLoading";
import Text from "@/components/i18n";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";

async function getDeviceLanguage() {
	let { value } = await Device.getLanguageCode();

	if (value === "en") {
		value = "en-US";
	}
	if (value === "zh") {
		value = "zh-CN";
	}

	return value;
}

const Root = styled("main")<{ disableTopPadding?: boolean }>(
	({ theme }) =>
		({ disableTopPadding }) => ({
			flexGrow: 1,
			paddingTop: !disableTopPadding
				? 0
				: "calc(var(--ion-safe-area-top) + 56px)",
			paddingRight: 0,
			[theme.breakpoints.up("sm")]: {
				paddingRight: "16px",
			},
			minHeight: "100vh",
		}),
);

function LayoutShell({
	children,
	dic,
}: {
	children: React.ReactNode;
	dic: string;
}) {
	const [sidebar, setSidebar] = useState(true);
	const [appBar, setAppBar] = useState(true);
	const [action, setAction] = useState<React.ReactNode>(null);
	const [title, setTitle] = useState("");
	const framed = useFrameState();
	const { locale: activeLocale } = useLocale();

	const localizedDic = useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<SidebarProvider value={{ sidebar, setSidebar }}>
			<AppBarProvider value={{ appBar, setAppBar }}>
				<ActionProvider value={{ action, setAction }}>
					<PageProvider value={{ title, setTitle }}>
						<Text
							dictionary={localizedDic || {}}
							language={activeLocale}
						>
							<CssBaseline />
							{framed && <Header />}
							<Box sx={{ display: "flex" }}>
								<Root disableTopPadding={!framed}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
										}}
									>
										<Sidebar />
										{children}
									</Box>
								</Root>
							</Box>
							<GlobalSnackbar />
							<GlobalLoading />
						</Text>
					</PageProvider>
				</ActionProvider>
			</AppBarProvider>
		</SidebarProvider>
	);
}

export default function RootLayoutClient({
	children,
	dic,
}: {
	children: React.ReactNode;
	dic: string;
}) {
	const pathname = usePathname();
	const [preferredLocale, setPreferredLocale] = useState("en-US");

	useEffect(() => {
		const readLocaleConfig = async () => {
			try {
				const { value: preferredSet } = await Preferences.get({
					key: "locale",
				});

				if (preferredSet) {
					if (
						preferredSet === "auto" &&
						Capacitor.isNativePlatform()
					) {
						setPreferredLocale(await getDeviceLanguage());
					} else if (preferredSet !== "auto" && isWeb()) {
						const locales = ["zh-CN", "en-US"];
						let pathLocaleActive = locales.some((locale) => {
							return window.location.pathname.includes(locale);
						});

						if (
							!pathLocaleActive &&
							preferredSet !== preferredLocale
						) {
							window.location.href = `/${preferredSet}${window.location.pathname}`;
						}
					} else if (
						preferredSet !== "auto" &&
						Capacitor.isNativePlatform()
					) {
						setPreferredLocale(preferredSet);
					}
				}
			} catch (error) {
				console.error("Error reading locale from storage:", error);
			}
		};

		readLocaleConfig();
	}, []);

	return (
		<ColorModeProvider>
			<LocaleProvider
				value={{
					locale: preferredLocale,
					setLocale: setPreferredLocale,
				}}
			>
				<LayoutShell dic={dic}>{children}</LayoutShell>
			</LocaleProvider>
		</ColorModeProvider>
	);
}
