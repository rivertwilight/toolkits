import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

const SHUTTER_SPEEDS = [
	"1/8000",
	"1/4000",
	"1/2000",
	"1/1000",
	"1/500",
	"1/250",
	"1/125",
	"1/60",
	"1/30",
	"1/15",
	"1/8",
	"1/4",
	"1/2",
	'1"',
	'2"',
	'4"',
	'8"',
	'15"',
	'30"',
	'60"',
	'120"',
	'240"',
	'480"',
];

const SHUTTER_VALUES: number[] = [
	1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125,
	1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30, 60,
	120, 240, 480,
];

const ND_FILTERS = [
	{ label: "ND2 (1 stop)", stops: 1 },
	{ label: "ND4 (2 stops)", stops: 2 },
	{ label: "ND8 (3 stops)", stops: 3 },
	{ label: "ND16 (4 stops)", stops: 4 },
	{ label: "ND32 (5 stops)", stops: 5 },
	{ label: "ND64 (6 stops)", stops: 6 },
	{ label: "ND128 (7 stops)", stops: 7 },
	{ label: "ND256 (8 stops)", stops: 8 },
	{ label: "ND512 (9 stops)", stops: 9 },
	{ label: "ND1000 (10 stops)", stops: 10 },
	{ label: "ND2000 (11 stops)", stops: 11 },
	{ label: "ND4000 (12 stops)", stops: 12 },
	{ label: "ND32000 (15 stops)", stops: 15 },
];

function formatShutterSpeed(seconds: number): string {
	if (seconds >= 60) {
		const mins = Math.round(seconds / 60);
		const secs = Math.round(seconds % 60);
		return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
	}
	if (seconds >= 1) return `${Math.round(seconds * 10) / 10}s`;
	const denom = Math.round(1 / seconds);
	return `1/${denom}s`;
}

const NdFilterCalculator: React.FC = () => {
	const [shutterIdx, setShutterIdx] = useState<number>(7); // 1/60
	const [ndStops, setNdStops] = useState<number>(6); // ND64

	const newShutter = useMemo(() => {
		const base = SHUTTER_VALUES[shutterIdx];
		return base * Math.pow(2, ndStops);
	}, [shutterIdx, ndStops]);

	const equivalenceChart = useMemo(() => {
		const base = SHUTTER_VALUES[shutterIdx];
		return ND_FILTERS.map((f) => ({
			...f,
			result: base * Math.pow(2, f.stops),
		}));
	}, [shutterIdx]);

	return (
		<Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
			<Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
				<TextField
					select
					label="Base Shutter Speed"
					value={shutterIdx}
					onChange={(e) => setShutterIdx(Number(e.target.value))}
					sx={{ minWidth: 200, flex: 1 }}
				>
					{SHUTTER_SPEEDS.map((s, i) => (
						<MenuItem key={s} value={i}>
							{s}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					label="ND Filter"
					value={ndStops}
					onChange={(e) => setNdStops(Number(e.target.value))}
					sx={{ minWidth: 200, flex: 1 }}
				>
					{ND_FILTERS.map((f) => (
						<MenuItem key={f.stops} value={f.stops}>
							{f.label}
						</MenuItem>
					))}
				</TextField>
			</Box>

			<Paper
				variant="outlined"
				sx={{ p: 3, mb: 3, textAlign: "center" }}
			>
				<Typography variant="body2" color="text.secondary">
					New Shutter Speed
				</Typography>
				<Typography
					variant="h3"
					sx={{ fontFamily: "monospace", fontWeight: "bold", my: 1 }}
				>
					{formatShutterSpeed(newShutter)}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{SHUTTER_SPEEDS[shutterIdx]} + {ndStops} stop
					{ndStops > 1 ? "s" : ""} ND
				</Typography>
			</Paper>

			<Divider sx={{ my: 3 }} />

			<Typography variant="h6" gutterBottom>
				Full ND Chart for {SHUTTER_SPEEDS[shutterIdx]}
			</Typography>
			<TableContainer component={Paper} variant="outlined">
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>ND Filter</TableCell>
							<TableCell>Stops</TableCell>
							<TableCell align="right">New Shutter</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{equivalenceChart.map((row) => (
							<TableRow
								key={row.stops}
								selected={row.stops === ndStops}
							>
								<TableCell>ND{Math.pow(2, row.stops)}</TableCell>
								<TableCell>{row.stops}</TableCell>
								<TableCell align="right">
									<Typography
										variant="body2"
										sx={{
											fontFamily: "monospace",
											fontWeight:
												row.stops === ndStops
													? "bold"
													: "normal",
										}}
									>
										{formatShutterSpeed(row.result)}
									</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default NdFilterCalculator;
