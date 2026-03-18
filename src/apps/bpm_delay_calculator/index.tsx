import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";

interface NoteRow {
	label: string;
	fraction: string;
	multiplier: number;
}

const NOTE_VALUES: NoteRow[] = [
	{ label: "Whole", fraction: "1/1", multiplier: 4 },
	{ label: "Half", fraction: "1/2", multiplier: 2 },
	{ label: "Quarter", fraction: "1/4", multiplier: 1 },
	{ label: "Eighth", fraction: "1/8", multiplier: 0.5 },
	{ label: "Sixteenth", fraction: "1/16", multiplier: 0.25 },
	{ label: "Thirty-second", fraction: "1/32", multiplier: 0.125 },
	{ label: "Dotted Half", fraction: "1/2 d", multiplier: 3 },
	{ label: "Dotted Quarter", fraction: "1/4 d", multiplier: 1.5 },
	{ label: "Dotted Eighth", fraction: "1/8 d", multiplier: 0.75 },
	{ label: "Dotted Sixteenth", fraction: "1/16 d", multiplier: 0.375 },
	{ label: "Triplet Half", fraction: "1/2 t", multiplier: 4 / 3 },
	{ label: "Triplet Quarter", fraction: "1/4 t", multiplier: 2 / 3 },
	{ label: "Triplet Eighth", fraction: "1/8 t", multiplier: 1 / 3 },
	{ label: "Triplet Sixteenth", fraction: "1/16 t", multiplier: 1 / 6 },
];

const BpmDelayCalculator: React.FC = () => {
	const [bpm, setBpm] = useState<number>(120);

	const rows = useMemo(() => {
		if (!bpm || bpm <= 0) return [];
		const msPerBeat = 60000 / bpm;
		return NOTE_VALUES.map((note) => {
			const ms = msPerBeat * note.multiplier;
			const hz = 1000 / ms;
			return {
				...note,
				ms: Math.round(ms * 100) / 100,
				hz: Math.round(hz * 1000) / 1000,
			};
		});
	}, [bpm]);

	const preDelay = useMemo(() => {
		if (!bpm || bpm <= 0) return null;
		const msPerBeat = 60000 / bpm;
		return {
			short: Math.round(msPerBeat * 0.0625 * 100) / 100,
			medium: Math.round(msPerBeat * 0.125 * 100) / 100,
			long: Math.round(msPerBeat * 0.25 * 100) / 100,
		};
	}, [bpm]);

	return (
		<Box sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
			<Box sx={{ mb: 3 }}>
				<TextField
					label="BPM"
					type="number"
					value={bpm}
					onChange={(e) => setBpm(Number(e.target.value))}
					fullWidth
					slotProps={{ htmlInput: { min: 1, max: 999 } }}
				/>
				<Slider
					value={bpm}
					onChange={(_, v) => setBpm(v as number)}
					min={20}
					max={300}
					sx={{ mt: 1 }}
				/>
			</Box>

			{rows.length > 0 && (
				<>
					<Typography variant="h6" gutterBottom>
						Delay Times
					</Typography>
					<TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Note</TableCell>
									<TableCell>Value</TableCell>
									<TableCell align="right">ms</TableCell>
									<TableCell align="right">Hz</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.label}>
										<TableCell>{row.label}</TableCell>
										<TableCell>
											<Typography
												variant="body2"
												sx={{ fontFamily: "monospace" }}
											>
												{row.fraction}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												variant="body2"
												sx={{
													fontFamily: "monospace",
													fontWeight: "bold",
												}}
											>
												{row.ms}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												variant="body2"
												sx={{ fontFamily: "monospace" }}
											>
												{row.hz}
											</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					{preDelay && (
						<>
							<Typography variant="h6" gutterBottom>
								Reverb Pre-Delay Guide
							</Typography>
							<TableContainer component={Paper} variant="outlined">
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Feel</TableCell>
											<TableCell>Fraction</TableCell>
											<TableCell align="right">Pre-Delay (ms)</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>Tight / Close</TableCell>
											<TableCell>1/64</TableCell>
											<TableCell align="right">
												<Typography
													variant="body2"
													sx={{
														fontFamily: "monospace",
														fontWeight: "bold",
													}}
												>
													{preDelay.short}
												</Typography>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Medium</TableCell>
											<TableCell>1/32</TableCell>
											<TableCell align="right">
												<Typography
													variant="body2"
													sx={{
														fontFamily: "monospace",
														fontWeight: "bold",
													}}
												>
													{preDelay.medium}
												</Typography>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Wide / Lush</TableCell>
											<TableCell>1/16</TableCell>
											<TableCell align="right">
												<Typography
													variant="body2"
													sx={{
														fontFamily: "monospace",
														fontWeight: "bold",
													}}
												>
													{preDelay.long}
												</Typography>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</>
					)}
				</>
			)}
		</Box>
	);
};

export default BpmDelayCalculator;
