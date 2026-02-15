"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { AutoAwesomeRounded } from "@mui/icons-material";
import Link from "next/link";
import { Theme, useMediaQuery, Chip, Tooltip } from "@mui/material";
import { useSidebar } from "@/contexts/sidebar";
import { usePage } from "@/contexts/page";
import { useAction } from "@/contexts/action";
import siteConfig from "src/site.config";
import { isWeb } from "@/utils/platform";
import Text from "./i18n";
import Search from "@/components/SearchBox";

function ElevationScroll({ children }: { children: React.ReactElement }) {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
	});

	return React.cloneElement(children, {
		elevation: trigger ? 3 : 0,
		sx: {
			borderBottom: trigger ? "" : "none",
		},
	});
}

export default function Navbar() {
	const { title } = usePage();
	const { action } = useAction();
	const { sidebar, setSidebar } = useSidebar();
	const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.only("xs"));

	const [showGetAppChip, setShowGetAppChip] = useState(true);

	return (
		<>
			<ElevationScroll>
				<AppBar
					color="secondary"
					position="fixed"
					sx={{
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
				>
					<Toolbar
						sx={{
							bgcolor: (theme) =>
								theme.palette.background.default,
							justifyContent: "space-between",
							position: "relative",
							paddingTop: "var(--ion-safe-area-top)",
						}}
					>
						<IconButton
							edge="start"
							size="large"
							aria-label="Toggle drawer"
							onClick={() => setSidebar(!sidebar)}
						>
							<MenuTwoToneIcon />
						</IconButton>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Link
								href="/"
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<Typography
									component="span"
									variant="h6"
									color="textPrimary"
									sx={{
										fontFamily: "Product Sans",
										cursor: "pointer",
									}}
								>
									{siteConfig.appName}
								</Typography>
							</Link>
							<Typography
								id="navbar-localTitle"
								color="primary"
								variant="h6"
								noWrap
								sx={{
									overflow: "hidden",
									fontFamily: "Product Sans",
									marginLeft: ".4em",
								}}
							>
								{title}
							</Typography>
						</Box>

						{!isXs && (
							<Box
								sx={{
									position: "absolute",
									left: "50%",
									transform: "translateX(-50%)",
									maxWidth: "500px",
									width: "100%",
									px: 2,
								}}
							>
								<Search />
							</Box>
						)}

						<Box sx={{ flexGrow: 1 }} />

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							{!isXs && showGetAppChip && isWeb() && (
								<Tooltip
									title={
										<Text k="navbar.downloadApp.tooltip" />
									}
								>
									<Chip
										icon={<AutoAwesomeRounded />}
										label={
											<Text k="navbar.downloadApp.label" />
										}
										onDelete={() =>
											setShowGetAppChip(false)
										}
										clickable
										sx={{
											mr: 2,
											background:
												"linear-gradient(45deg, #27ae60 30%, #2980b9 90%)",
											color: "white",
											"& .MuiChip-icon": {
												color: "white",
											},
											"& .MuiChip-deleteIcon": {
												color: "white",
											},
										}}
										onClick={() => {
											window.open(
												"https://www.ygeeker.com/geekits",
												"_blank",
											);
										}}
									/>
								</Tooltip>
							)}
							{action}
						</Box>
					</Toolbar>
				</AppBar>
			</ElevationScroll>
		</>
	);
}
