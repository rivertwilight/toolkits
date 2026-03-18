import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";

function latLngToMaidenhead(lat: number, lng: number): string {
	const adjustedLng = lng + 180;
	const adjustedLat = lat + 90;

	const field1 = String.fromCharCode(65 + Math.floor(adjustedLng / 20));
	const field2 = String.fromCharCode(65 + Math.floor(adjustedLat / 10));

	const square1 = Math.floor((adjustedLng % 20) / 2);
	const square2 = Math.floor(adjustedLat % 10);

	const sub1 = String.fromCharCode(
		97 + Math.floor(((adjustedLng % 2) * 60) / 5)
	);
	const sub2 = String.fromCharCode(
		97 + Math.floor(((adjustedLat % 1) * 60) / 2.5)
	);

	return `${field1}${field2}${square1}${square2}${sub1}${sub2}`;
}

function maidenheadToLatLng(
	grid: string
): { lat: number; lng: number } | null {
	const g = grid.trim();
	if (g.length < 4 || g.length > 8 || g.length % 2 !== 0) return null;

	const upper = g.toUpperCase();

	const f1 = upper.charCodeAt(0) - 65;
	const f2 = upper.charCodeAt(1) - 65;
	if (f1 < 0 || f1 > 17 || f2 < 0 || f2 > 17) return null;

	const s1 = parseInt(upper[2]);
	const s2 = parseInt(upper[3]);
	if (isNaN(s1) || isNaN(s2)) return null;

	let lng = f1 * 20 + s1 * 2 - 180;
	let lat = f2 * 10 + s2 - 90;

	if (g.length >= 6) {
		const ss1 = upper.charCodeAt(4) - 65;
		const ss2 = upper.charCodeAt(5) - 65;
		if (ss1 < 0 || ss1 > 23 || ss2 < 0 || ss2 > 23) return null;
		lng += (ss1 * 5) / 60;
		lat += (ss2 * 2.5) / 60;
	}

	if (g.length >= 8) {
		const e1 = parseInt(upper[6]);
		const e2 = parseInt(upper[7]);
		if (isNaN(e1) || isNaN(e2)) return null;
		lng += (e1 * 5) / 600;
		lat += (e2 * 2.5) / 600;
	}

	// Center of the grid square
	if (g.length === 4) {
		lng += 1;
		lat += 0.5;
	} else if (g.length === 6) {
		lng += 5 / 120;
		lat += 2.5 / 120;
	} else if (g.length === 8) {
		lng += 5 / 1200;
		lat += 2.5 / 1200;
	}

	return {
		lat: Math.round(lat * 10000) / 10000,
		lng: Math.round(lng * 10000) / 10000,
	};
}

const MaidenheadLocator: React.FC = () => {
	const [grid, setGrid] = useState("");
	const [lat, setLat] = useState("");
	const [lng, setLng] = useState("");
	const [result, setResult] = useState<string>("");
	const [error, setError] = useState("");

	const convertGridToLatLng = useCallback(() => {
		setError("");
		const coords = maidenheadToLatLng(grid);
		if (!coords) {
			setError(
				"Invalid grid square. Use 4, 6, or 8 characters (e.g. PM85, PM85fb, PM85fb12)."
			);
			return;
		}
		setLat(String(coords.lat));
		setLng(String(coords.lng));
		setResult("");
	}, [grid]);

	const convertLatLngToGrid = useCallback(() => {
		setError("");
		const la = parseFloat(lat);
		const ln = parseFloat(lng);
		if (isNaN(la) || isNaN(ln) || la < -90 || la > 90 || ln < -180 || ln > 180) {
			setError("Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180.");
			return;
		}
		const g = latLngToMaidenhead(la, ln);
		setGrid(g);
		setResult(g);
	}, [lat, lng]);

	const useMyLocation = useCallback(() => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser.");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const la = Math.round(pos.coords.latitude * 10000) / 10000;
				const ln = Math.round(pos.coords.longitude * 10000) / 10000;
				setLat(String(la));
				setLng(String(ln));
				const g = latLngToMaidenhead(la, ln);
				setGrid(g);
				setResult(g);
				setError("");
			},
			() => setError("Could not get your location.")
		);
	}, []);

	return (
		<Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Typography variant="h6" gutterBottom>
				Grid Square to Coordinates
			</Typography>
			<Box sx={{ display: "flex", gap: 1, mb: 3 }}>
				<TextField
					label="Grid Square"
					value={grid}
					onChange={(e) => setGrid(e.target.value)}
					placeholder="e.g. PM85fb"
					sx={{ flex: 1 }}
					slotProps={{ htmlInput: { maxLength: 8 } }}
				/>
				<Button variant="contained" onClick={convertGridToLatLng}>
					Convert
				</Button>
			</Box>

			<Divider sx={{ my: 3 }} />

			<Typography variant="h6" gutterBottom>
				Coordinates to Grid Square
			</Typography>
			<Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
				<TextField
					label="Latitude"
					type="number"
					value={lat}
					onChange={(e) => setLat(e.target.value)}
					placeholder="e.g. 35.6762"
					sx={{ flex: 1, minWidth: 120 }}
					slotProps={{ htmlInput: { min: -90, max: 90, step: 0.0001 } }}
				/>
				<TextField
					label="Longitude"
					type="number"
					value={lng}
					onChange={(e) => setLng(e.target.value)}
					placeholder="e.g. 139.6503"
					sx={{ flex: 1, minWidth: 120 }}
					slotProps={{ htmlInput: { min: -180, max: 180, step: 0.0001 } }}
				/>
				<Button variant="contained" onClick={convertLatLngToGrid}>
					Convert
				</Button>
			</Box>
			<Button size="small" onClick={useMyLocation} sx={{ mb: 3 }}>
				Use My Location
			</Button>

			{result && (
				<Paper
					variant="outlined"
					sx={{ p: 3, textAlign: "center" }}
				>
					<Typography variant="body2" color="text.secondary">
						Your Grid Square
					</Typography>
					<Typography
						variant="h3"
						sx={{ fontFamily: "monospace", fontWeight: "bold", my: 1 }}
					>
						{result}
					</Typography>
				</Paper>
			)}
		</Box>
	);
};

export default MaidenheadLocator;
