import React, { useState, useMemo } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	Stack,
	Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OutlinedCard from "@/components/OutlinedCard";

const SAMPLE_JWT =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.2fsNMOmSGMHqxRTqj3gSPH_NgZD13VwwEP0gttMo9Vk";

function base64UrlDecode(str: string): string {
	let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
	const pad = base64.length % 4;
	if (pad) {
		base64 += "=".repeat(4 - pad);
	}
	return atob(base64);
}

function toHex(str: string): string {
	return Array.from(str)
		.map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
		.join("");
}

function formatDate(epoch: number): string {
	return new Date(epoch * 1000).toLocaleString();
}

interface DecodedJWT {
	header: Record<string, unknown>;
	payload: Record<string, unknown>;
	signatureHex: string;
}

function decodeJWT(token: string): DecodedJWT {
	const parts = token.trim().split(".");
	if (parts.length !== 3) {
		throw new Error(
			"Invalid JWT: expected 3 parts separated by dots, got " +
				parts.length
		);
	}

	let header: Record<string, unknown>;
	try {
		header = JSON.parse(base64UrlDecode(parts[0]));
	} catch {
		throw new Error("Invalid JWT: could not decode header");
	}

	let payload: Record<string, unknown>;
	try {
		payload = JSON.parse(base64UrlDecode(parts[1]));
	} catch {
		throw new Error("Invalid JWT: could not decode payload");
	}

	let signatureHex: string;
	try {
		signatureHex = toHex(base64UrlDecode(parts[2]));
	} catch {
		throw new Error("Invalid JWT: could not decode signature");
	}

	return { header, payload, signatureHex };
}

const JwtDecoder: React.FC = () => {
	const [token, setToken] = useState("");

	const result = useMemo(() => {
		if (!token.trim()) return null;
		try {
			return { decoded: decodeJWT(token), error: null };
		} catch (e) {
			return { decoded: null, error: (e as Error).message };
		}
	}, [token]);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const renderTimeClaim = (label: string, value: unknown) => {
		if (typeof value !== "number") return null;
		const date = formatDate(value);
		return (
			<Typography
				variant="body2"
				sx={{ fontFamily: "monospace", mt: 0.5 }}
			>
				{label}: {date}
			</Typography>
		);
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
			<TextField
				fullWidth
				multiline
				minRows={4}
				maxRows={10}
				label="JWT Token"
				value={token}
				onChange={(e) => setToken(e.target.value)}
				placeholder="Paste your JWT token here..."
				sx={{ mb: 2 }}
				InputProps={{ sx: { fontFamily: "monospace", fontSize: 14 } }}
			/>

			<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
				<Button
					variant="outlined"
					onClick={() => setToken(SAMPLE_JWT)}
				>
					Load Sample JWT
				</Button>
				<Button
					variant="text"
					onClick={() => setToken("")}
					disabled={!token}
				>
					Clear
				</Button>
			</Stack>

			{result?.error && (
				<OutlinedCard padding={2}>
					<Typography
						color="error"
						variant="body2"
						sx={{ fontFamily: "monospace" }}
					>
						{result.error}
					</Typography>
				</OutlinedCard>
			)}

			{result?.decoded && (
				<Stack spacing={3}>
					{/* Header */}
					<Box>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={1}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								Header
							</Typography>
							<Button
								size="small"
								startIcon={<ContentCopyIcon />}
								onClick={() =>
									copyToClipboard(
										JSON.stringify(
											result.decoded!.header,
											null,
											2
										)
									)
								}
							>
								Copy
							</Button>
						</Box>
						<OutlinedCard padding={2}>
							<Typography
								component="pre"
								variant="body2"
								sx={{
									fontFamily: "monospace",
									whiteSpace: "pre-wrap",
									wordBreak: "break-word",
									m: 0,
								}}
							>
								{JSON.stringify(
									result.decoded.header,
									null,
									2
								)}
							</Typography>
						</OutlinedCard>
					</Box>

					{/* Payload */}
					<Box>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={1}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								Payload
							</Typography>
							<Button
								size="small"
								startIcon={<ContentCopyIcon />}
								onClick={() =>
									copyToClipboard(
										JSON.stringify(
											result.decoded!.payload,
											null,
											2
										)
									)
								}
							>
								Copy
							</Button>
						</Box>
						<OutlinedCard padding={2}>
							<>
								<Typography
									component="pre"
									variant="body2"
									sx={{
										fontFamily: "monospace",
										whiteSpace: "pre-wrap",
										wordBreak: "break-word",
										m: 0,
									}}
								>
									{JSON.stringify(
										result.decoded.payload,
										null,
										2
									)}
								</Typography>

								<Box sx={{ mt: 2 }}>
									{typeof result.decoded.payload.exp ===
										"number" && (
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											sx={{ mt: 1 }}
										>
											<Typography
												variant="body2"
												sx={{
													fontFamily: "monospace",
												}}
											>
												exp:{" "}
												{formatDate(
													result.decoded.payload
														.exp as number
												)}
											</Typography>
											{Date.now() / 1000 >
											(result.decoded.payload
												.exp as number) ? (
												<Chip
													label="Expired"
													size="small"
													color="error"
												/>
											) : (
												<Chip
													label="Valid"
													size="small"
													color="success"
												/>
											)}
										</Stack>
									)}
									{renderTimeClaim(
										"iat",
										result.decoded.payload.iat
									)}
									{renderTimeClaim(
										"nbf",
										result.decoded.payload.nbf
									)}
								</Box>
							</>
						</OutlinedCard>
					</Box>

					{/* Signature */}
					<Box>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={1}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								Signature
							</Typography>
							<Button
								size="small"
								startIcon={<ContentCopyIcon />}
								onClick={() =>
									copyToClipboard(
										result.decoded!.signatureHex
									)
								}
							>
								Copy
							</Button>
						</Box>
						<OutlinedCard padding={2}>
							<Typography
								variant="body2"
								sx={{
									fontFamily: "monospace",
									wordBreak: "break-all",
									m: 0,
								}}
							>
								{result.decoded.signatureHex}
							</Typography>
						</OutlinedCard>
					</Box>
				</Stack>
			)}
		</Box>
	);
};

export default JwtDecoder;
