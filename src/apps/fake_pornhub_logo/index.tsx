import React, { useState } from "react";
import html2canvas from "html2canvas";
import saveFile from "../../utils/fileSaver";
import {
	Slider,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Switch,
	Box,
	Paper,
	Stack,
	IconButton,
	Tooltip,
	Typography,
	Chip,
	TextField,
} from "@mui/material";
import BorderVerticalIcon from "@mui/icons-material/BorderVertical";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import OutlinedCard from "../../components/OutlinedCard";
import Text, { t } from "@/components/i18n";

const IfBr = ({ statu }: { statu: string }) =>
	statu === "vertical" ? <br /> : null;

const FakeLogo = ({ hStyle, frontStyle, lastStyle, dimensions }: any) => {
	return (
		<Paper
			elevation={0}
			sx={{
				width: "100%",
				maxWidth: "600px",
				height: 0,
				paddingTop: `${(dimensions.height / dimensions.width) * 100}%`,
				position: "relative",
				bgcolor: "#000000",
				overflow: "hidden",
				borderRadius: 0,
			}}
			id="blackborad"
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						width: "100%",
						px: 2,
					}}
				>
					<Typography
						component="h1"
						sx={{
							fontFamily: `"SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif, SimHei,STHeiti`,
							fontWeight: 1000,
							letterSpacing: "-1.5px",
							fontSize: {
								xs: `${hStyle.size * 0.7}em`,
								sm: `${hStyle.size}em`,
							},
							textAlign: "center",
							wordBreak: "break-word",
						}}
					>
						<Box
							component="span"
							sx={{
								borderRadius: 1,
								color: frontStyle.color,
								bgcolor: frontStyle.backgroundColor,
								px: 0.5,
							}}
							contentEditable
							suppressContentEditableWarning
						>
							Tool
						</Box>
						<IfBr statu={hStyle.array} />
						<Box
							component="span"
							sx={{
								display: "inline",
								bgcolor: lastStyle.backgroundColor,
								borderRadius: 1,
								color: lastStyle.color,
								px: 0.5,
								ml: 0.5,
							}}
							contentEditable
							suppressContentEditableWarning
						>
							kits
						</Box>
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
};

const FakePornhubLogo = () => {
	const [hStyle, setHStyle] = useState({
		size: 4.0,
		array: "transverse",
	});

	const [front, setFront] = useState({
		color: "#ffffff",
		backgroundColor: "transparent",
	});

	const [last, setLast] = useState({
		color: "#000000",
		backgroundColor: "#f79817",
	});

	// Add Safari detection
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	const dimensionPresets = [
		{ label: "1080 × 1080", width: 1080, height: 1080 },
		{ label: "1920 × 1080", width: 1920, height: 1080 },
		{ label: "1200 × 630", width: 1200, height: 630 },
		{ label: "800 × 400", width: 800, height: 400 },
	];

	const [dimensions, setDimensions] = useState({
		width: 800,
		height: 400,
	});

	const getPreviewText = () => {
		const el = document.querySelector("#blackborad");
		if (!el) return "logo";
		const spans = el.querySelectorAll("[contenteditable]");
		return Array.from(spans)
			.map((s) => s.textContent?.trim())
			.filter(Boolean)
			.join("");
	};

	const handleDownload = async () => {
		const canvas = await html2canvas(document.querySelector("#blackborad"));
		const base64 = canvas.toDataURL("image/png");
		const filename = getPreviewText() || "logo";
		saveFile({
			file: base64,
			type: "png",
			filename: `${filename}.png`,
		});
	};

	const handleCopy = async () => {
		const canvas = await html2canvas(document.querySelector("#blackborad"));
		canvas.toBlob(async (blob) => {
			if (blob) {
				try {
					await navigator.clipboard.write([
						new ClipboardItem({ "image/png": blob }),
					]);
					window.snackbar({
						message: "Copied to clipboard",
						duration: 2000,
					});
				} catch (err) {
					console.error("Failed to copy:", err);
				}
			}
		});
	};

	const handleFontSizeChange = (
		event: Event,
		newValue: number | number[],
	) => {
		console.log("handleFontSizeChange", event, newValue);
		if (typeof newValue === "number") {
			setHStyle({ ...hStyle, size: newValue });
		}
	};

	return (
		<Stack
			direction={{ xs: "column", md: "row" }}
			spacing={3}
			sx={{
				px: { xs: 0, sm: 2 },
				py: 3,
				width: "100%",
				mx: "auto",
			}}
		>
			{/* Left Column - Preview */}
			<Stack
				spacing={2}
				alignItems="center"
				sx={{
					flex: 1,
					minWidth: 0,
				}}
			>
				<Box
					sx={{
						width: "100%",
						aspectRatio: "4 / 3",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						bgcolor: (theme) =>
							theme.palette.mode === "dark"
								? "grey.900"
								: "grey.100",
						backgroundImage:
							"linear-gradient(45deg, rgba(128,128,128,0.1) 25%, transparent 25%, transparent 75%, rgba(128,128,128,0.1) 75%), linear-gradient(45deg, rgba(128,128,128,0.1) 25%, transparent 25%, transparent 75%, rgba(128,128,128,0.1) 75%)",
						backgroundSize: "20px 20px",
						backgroundPosition: "0 0, 10px 10px",
						borderRadius: 2,
						border: 1,
						borderColor: "divider",
						overflow: "hidden",
						p: 6,
					}}
				>
					<FakeLogo
						hStyle={hStyle}
						frontStyle={front}
						lastStyle={last}
						dimensions={dimensions}
					/>
				</Box>

				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ textAlign: "center" }}
				>
					{t("Tap the text in preview to edit")}
				</Typography>

				<Stack direction="row" spacing={2} justifyContent="center">
					<Tooltip
						title={
							isSafari
								? t("Safari doesn't support copying images")
								: t("Copy")
						}
					>
						<span>
							<IconButton
								onClick={handleCopy}
								color="primary"
								disabled={isSafari}
							>
								<ContentCopyIcon />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title={t("Download")}>
						<IconButton onClick={handleDownload} color="primary">
							<FileDownloadIcon />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>

			{/* Right Column - Settings */}
			<List
				sx={{
					flex: 1,
					minWidth: 0,
					padding: 0,
				}}
			>
				<OutlinedCard padding={2}>
					<Typography gutterBottom>
						{`${t("app.pornhub.fontSize")}: ${hStyle.size}`}
					</Typography>
					<Slider
						aria-label="Font Size"
						value={hStyle.size}
						onChange={handleFontSizeChange}
						min={1}
						max={10}
						marks
						step={0.5}
					/>
				</OutlinedCard>

				<OutlinedCard padding={2} style={{ marginTop: 10 }}>
					<Typography gutterBottom>{t("Dimensions")}</Typography>
					<Stack
						direction="row"
						spacing={1}
						sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}
					>
						{dimensionPresets.map((preset) => (
							<Chip
								key={preset.label}
								label={preset.label}
								size="small"
								variant={
									dimensions.width === preset.width &&
									dimensions.height === preset.height
										? "filled"
										: "outlined"
								}
								color={
									dimensions.width === preset.width &&
									dimensions.height === preset.height
										? "primary"
										: "default"
								}
								onClick={() =>
									setDimensions({
										width: preset.width,
										height: preset.height,
									})
								}
							/>
						))}
					</Stack>
					<Stack direction="row" spacing={2}>
						<TextField
							label={t("Width")}
							type="number"
							size="small"
							value={dimensions.width}
							onChange={(e) =>
								setDimensions({
									...dimensions,
									width: parseInt(e.target.value, 10) || 1,
								})
							}
							slotProps={{
								htmlInput: { min: 1 },
							}}
						/>
						<TextField
							label={t("Height")}
							type="number"
							size="small"
							value={dimensions.height}
							onChange={(e) =>
								setDimensions({
									...dimensions,
									height: parseInt(e.target.value, 10) || 1,
								})
							}
							slotProps={{
								htmlInput: { min: 1 },
							}}
						/>
					</Stack>
				</OutlinedCard>

				<OutlinedCard padding={1} style={{ marginTop: 10 }}>
					<ListItem>
						<ListItemIcon>
							<BorderVerticalIcon />
						</ListItemIcon>
						<ListItemText
							primary={<Text k="app.pornhub.vertical" />}
						/>
						<ListItemSecondaryAction>
							<Switch
								edge="end"
								onChange={(_, checked) =>
									setHStyle({
										...hStyle,
										array: checked
											? "vertical"
											: "transverse",
									})
								}
								checked={hStyle.array === "vertical"}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</OutlinedCard>

				<OutlinedCard padding={1} style={{ marginTop: 10 }}>
					<ListItem>
						<ListItemIcon>
							<ColorLensIcon />
						</ListItemIcon>
						<ListItemText
							primary={<Text k="app.pornhub.colorRevert" />}
						/>
						<ListItemSecondaryAction>
							<Switch
								edge="end"
								onChange={(_, checked) => {
									if (checked) {
										setFront({
											color: "#000000",
											backgroundColor:
												last.backgroundColor,
										});
										setLast({
											color: "#ffffff",
											backgroundColor: "transparent",
										});
									} else {
										setFront({
											color: "#ffffff",
											backgroundColor: "transparent",
										});
										setLast({
											color: "#000000",
											backgroundColor:
												front.backgroundColor,
										});
									}
								}}
								checked={front.color === "#000000"}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</OutlinedCard>
			</List>
		</Stack>
	);
};

export default FakePornhubLogo;
