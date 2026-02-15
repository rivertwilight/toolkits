import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Navbar";
// import MetaInfo from "../MetaInfo";
import Sidebar from "@/components/Sidebar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import GlobalLoading from "@/components/GlobalLoading";
import siteConfig from "../site.config.js";
import { SidebarProvider } from "@/contexts/sidebar";
import { ActionProvider } from "@/contexts/action";
import { AppBarProvider } from "@/contexts/appBar";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";

const Root = styled("main")<{ disableTopPadding?: boolean }>(
	({ theme }) =>
		({ disableTopPadding }) => ({
			flexGrow: 1,
			paddingTop: !disableTopPadding
				? 0
				: "calc(var(--ion-safe-area-top) + 56px)",
			minHeight: "100vh",
			// position: "relative",
		})
);

const GlobalSnackbar = () => {
	const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
	const [snackbarConfig, setSnackbarConfig] = useState({
		message: "无消息",
	});
	useEffect(() => {
		window.snackbar = (config) => {
			if (Capacitor.isNativePlatform()) {
				// Show native toast on mobile platforms
				Toast.show({
					text: config.message,
					duration: config.autoHideDuration || "short",
					position: "bottom",
				});
			} else {
				setSnackbarConfig(config);
				setOpenSnackbar(true);
			}
		};
	});
	const handleSnackbarClose = () => {
		setOpenSnackbar(false);
	};
	return (
		<Snackbar
			{...snackbarConfig}
			open={openSnackbar}
			onClose={handleSnackbarClose}
		/>
	);
};

const Layout = ({ currentPage, children, enableFrame, appData }) => {
	const [sidebar, setSidebar] = useState(true);
	const [appBar, setAppBar] = useState(true);
	const [action, setAction] = useState(null);
	const metaTitle = `${
		currentPage
			? `${currentPage.title} - ${siteConfig.appName}`
			: siteConfig.appName
	}`;

	const activeDescription = currentPage.description || siteConfig.description;

	const activeKeywords = currentPage.keywords || siteConfig.keywords;

	return (
		<SidebarProvider value={{ sidebar: sidebar, setSidebar: setSidebar }}>
			<AppBarProvider value={{ appBar, setAppBar }}>
				<ActionProvider
					value={{ action: action, setAction: setAction }}
				>
					<Head>
						<title>{metaTitle}</title>
						<meta charSet="utf-8" />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no"
						/>
						<meta name="description" content={activeDescription} />
						<meta
							name="keywords"
							content={activeKeywords.join(",")}
						/>
						<meta name="author" content={siteConfig.author.name} />

						<link
							rel="canonical"
							href={`${siteConfig.root}${currentPage.path}`}
						/>
						<link
							rel="alternate"
							href={`${siteConfig.root}/zh-CN`}
							hrefLang="zh-CN"
						/>
						<link
							rel="alternate"
							href={`${siteConfig.root}/en-US`}
							hrefLang="en-US"
						/>

						<meta property="og:title" content={metaTitle} />
						<meta
							property="og:description"
							content={activeDescription}
						/>
						<meta property="og:type" content="website" />
						<meta
							property="og:url"
							content={`${siteConfig.root}${currentPage.path}`}
						/>
						<meta
							property="og:site_name"
							content={siteConfig.appName}
						/>
						<meta
							property="og:image"
							content={`${siteConfig.root}/image/general_og.png`}
						/>
						<meta property="og:locale" content="zh_CN" />

						<meta
							name="twitter:card"
							content="summary_large_image"
						/>
						<meta name="twitter:site" content="@YGeeker_Official" />
						<meta name="twitter:title" content={metaTitle} />
						<meta
							name="twitter:description"
							content={activeDescription}
						/>
						<meta
							name="twitter:image"
							content={`${siteConfig.root}/image/general_og.png`}
						/>

						<meta
							name="google-site-verification"
							content="3yqvRLDwkcm7nwNQ5bSG06I4wQ5ASf23HUtcyZIaz3I"
						/>

						<link
							rel="sitemap"
							type="application/xml"
							title="Sitemap"
							href="/sitemap.xml"
						/>
					</Head>
					<CssBaseline />
						{enableFrame && (
						<Header
							repo={siteConfig.repo}
							appData={appData}
							PageAction={action}
							title={
								[].includes(currentPage.path)
									? ""
									: currentPage.title
							}
						/>
					)}
					<Box sx={{ display: "flex" }}>
						<CssBaseline />
						<Root disableTopPadding={!enableFrame}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									// marginTop: { xs: 0, sm: 2 },
								}}
							>
								<Sidebar />
								{children}
							</Box>
						</Root>
					</Box>
					<GlobalSnackbar />
					<GlobalLoading />
				</ActionProvider>
			</AppBarProvider>
		</SidebarProvider>
	);
};

export default Layout;
