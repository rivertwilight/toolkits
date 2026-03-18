import React, { useState } from "react";
import {
	Box,
	TextField,
	Typography,
	Stack,
	Chip,
	Checkbox,
	FormControlLabel,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Button,
	IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OutlinedCard from "@/components/OutlinedCard";

type Perms = [
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
];

const ROLES = ["Owner", "Group", "Others"] as const;
const BITS = ["Read", "Write", "Execute"] as const;

const PRESETS: { label: string; octal: string }[] = [
	{ label: "644 (files default)", octal: "644" },
	{ label: "755 (executable)", octal: "755" },
	{ label: "600 (private)", octal: "600" },
	{ label: "777 (full access)", octal: "777" },
	{ label: "400 (read-only)", octal: "400" },
];

const DEFAULT_PERMS: Perms = [
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
]; // 755

const permsToOctal = (perms: Perms): string => {
	let result = "";
	for (let i = 0; i < 3; i++) {
		const r = perms[i * 3] ? 4 : 0;
		const w = perms[i * 3 + 1] ? 2 : 0;
		const x = perms[i * 3 + 2] ? 1 : 0;
		result += (r + w + x).toString();
	}
	return result;
};

const permsToSymbolic = (perms: Perms): string => {
	return perms.map((p, i) => (p ? "rwx"[i % 3] : "-")).join("");
};

const octalToPerms = (octal: string): Perms | null => {
	if (!/^[0-7]{3}$/.test(octal)) return null;
	const perms: boolean[] = [];
	for (const ch of octal) {
		const n = parseInt(ch, 10);
		perms.push((n & 4) !== 0);
		perms.push((n & 2) !== 0);
		perms.push((n & 1) !== 0);
	}
	return perms as unknown as Perms;
};

const symbolicToPerms = (sym: string): Perms | null => {
	if (sym.length !== 9) return null;
	const pattern = /^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/;
	if (!pattern.test(sym)) return null;
	return sym.split("").map((ch) => ch !== "-") as unknown as Perms;
};

const ChmodCalculator: React.FC = () => {
	const [perms, setPerms] = useState<Perms>(DEFAULT_PERMS);
	const [octalInput, setOctalInput] = useState("");
	const [symbolicInput, setSymbolicInput] = useState("");

	const octal = permsToOctal(perms);
	const symbolic = permsToSymbolic(perms);
	const chmodCommand = `chmod ${octal} filename`;

	const togglePerm = (index: number) => {
		const next = [...perms] as unknown as Perms;
		next[index] = !next[index];
		setPerms(next);
		setOctalInput("");
		setSymbolicInput("");
	};

	const handleOctalChange = (value: string) => {
		setOctalInput(value);
		const parsed = octalToPerms(value);
		if (parsed) {
			setPerms(parsed);
			setSymbolicInput("");
		}
	};

	const handleSymbolicChange = (value: string) => {
		setSymbolicInput(value);
		const parsed = symbolicToPerms(value);
		if (parsed) {
			setPerms(parsed);
			setOctalInput("");
		}
	};

	const applyPreset = (preset: string) => {
		const parsed = octalToPerms(preset);
		if (parsed) {
			setPerms(parsed);
			setOctalInput("");
			setSymbolicInput("");
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
			<OutlinedCard>
				<Box sx={{ px: 2, py: 2 }}>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						Permissions
					</Typography>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Role</TableCell>
								<TableCell align="center">Read</TableCell>
								<TableCell align="center">Write</TableCell>
								<TableCell align="center">
									Execute
								</TableCell>
								<TableCell align="center">Octal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ROLES.map((role, ri) => {
								const r = perms[ri * 3] ? 4 : 0;
								const w = perms[ri * 3 + 1] ? 2 : 0;
								const x = perms[ri * 3 + 2] ? 1 : 0;
								return (
									<TableRow key={role}>
										<TableCell>{role}</TableCell>
										{BITS.map((bit, bi) => (
											<TableCell
												key={bit}
												align="center"
											>
												<Checkbox
													checked={
														perms[ri * 3 + bi]
													}
													onChange={() =>
														togglePerm(
															ri * 3 + bi
														)
													}
													size="small"
												/>
											</TableCell>
										))}
										<TableCell align="center">
											<Typography
												sx={{
													fontFamily: "monospace",
													fontWeight: 600,
												}}
											>
												{r + w + x}
											</Typography>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Box>
			</OutlinedCard>

			<Stack spacing={2} sx={{ mt: 2 }}>
				<OutlinedCard>
					<Box sx={{ px: 2, py: 1.5 }}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								variant="subtitle2"
								color="text.secondary"
							>
								Octal
							</Typography>
							<Typography
								sx={{
									fontFamily: "monospace",
									fontSize: 20,
									fontWeight: 700,
								}}
							>
								{octal}
							</Typography>
						</Box>
					</Box>
				</OutlinedCard>

				<OutlinedCard>
					<Box sx={{ px: 2, py: 1.5 }}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								variant="subtitle2"
								color="text.secondary"
							>
								Symbolic
							</Typography>
							<Typography
								sx={{
									fontFamily: "monospace",
									fontSize: 20,
									fontWeight: 700,
								}}
							>
								{symbolic}
							</Typography>
						</Box>
					</Box>
				</OutlinedCard>

				<OutlinedCard>
					<Box sx={{ px: 2, py: 1.5 }}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								variant="subtitle2"
								color="text.secondary"
							>
								Command
							</Typography>
							<Box
								display="flex"
								alignItems="center"
								gap={1}
							>
								<Typography
									sx={{
										fontFamily: "monospace",
										fontSize: 16,
										fontWeight: 600,
									}}
								>
									{chmodCommand}
								</Typography>
								<IconButton
									size="small"
									onClick={() =>
										copyToClipboard(chmodCommand)
									}
								>
									<ContentCopyIcon fontSize="small" />
								</IconButton>
							</Box>
						</Box>
					</Box>
				</OutlinedCard>

				<TextField
					label="Enter octal (e.g. 755)"
					value={octalInput}
					onChange={(e) => handleOctalChange(e.target.value)}
					placeholder="755"
					size="small"
					fullWidth
					inputProps={{ maxLength: 3, style: { fontFamily: "monospace" } }}
				/>

				<TextField
					label="Enter symbolic (e.g. rwxr-xr-x)"
					value={symbolicInput}
					onChange={(e) => handleSymbolicChange(e.target.value)}
					placeholder="rwxr-xr-x"
					size="small"
					fullWidth
					inputProps={{ maxLength: 9, style: { fontFamily: "monospace" } }}
				/>

				<Box>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 1 }}
					>
						Common Presets
					</Typography>
					<Stack
						direction="row"
						spacing={1}
						flexWrap="wrap"
						useFlexGap
					>
						{PRESETS.map((preset) => (
							<Chip
								key={preset.octal}
								label={preset.label}
								onClick={() => applyPreset(preset.octal)}
								variant={
									octal === preset.octal
										? "filled"
										: "outlined"
								}
								color={
									octal === preset.octal
										? "primary"
										: "default"
								}
							/>
						))}
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
};

export default ChmodCalculator;
