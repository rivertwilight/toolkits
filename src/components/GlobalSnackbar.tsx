"use client";

import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";

const GlobalSnackbar = () => {
	const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
	const [snackbarConfig, setSnackbarConfig] = useState({
		message: "无消息",
	});
	useEffect(() => {
		window.snackbar = (config) => {
			if (Capacitor.isNativePlatform()) {
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

export default GlobalSnackbar;
