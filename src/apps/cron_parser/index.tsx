import React, { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	Stack,
	Chip,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OutlinedCard from "@/components/OutlinedCard";

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

interface Preset {
	label: string;
	value: string;
}

const PRESETS: Preset[] = [
	{ label: "Every minute", value: "*/1 * * * *" },
	{ label: "Every hour", value: "0 * * * *" },
	{ label: "Daily at midnight", value: "0 0 * * *" },
	{ label: "Weekdays 9am", value: "0 9 * * 1-5" },
	{ label: "Every Sunday", value: "0 0 * * 0" },
];

function parseField(field: string, min: number, max: number): number[] {
	const values: Set<number> = new Set();

	for (const part of field.split(",")) {
		const stepMatch = part.match(/^(.+)\/(\d+)$/);
		let range: string;
		let step = 1;

		if (stepMatch) {
			range = stepMatch[1];
			step = parseInt(stepMatch[2], 10);
		} else {
			range = part;
		}

		if (range === "*") {
			for (let i = min; i <= max; i += step) {
				values.add(i);
			}
		} else if (range.includes("-")) {
			const [start, end] = range.split("-").map(Number);
			for (let i = start; i <= end; i += step) {
				values.add(i);
			}
		} else {
			values.add(parseInt(range, 10));
		}
	}

	return Array.from(values).sort((a, b) => a - b);
}

function describeField(
	field: string,
	type: "minute" | "hour" | "dom" | "month" | "dow"
): string {
	if (field === "*") {
		switch (type) {
			case "minute":
				return "every minute";
			case "hour":
				return "every hour";
			case "dom":
				return "every day";
			case "month":
				return "every month";
			case "dow":
				return "every day of the week";
		}
	}

	const stepMatch = field.match(/^\*\/(\d+)$/);
	if (stepMatch) {
		const n = stepMatch[1];
		switch (type) {
			case "minute":
				return `every ${n} minute(s)`;
			case "hour":
				return `every ${n} hour(s)`;
			case "dom":
				return `every ${n} day(s)`;
			case "month":
				return `every ${n} month(s)`;
			case "dow":
				return `every ${n} day(s) of the week`;
		}
	}

	if (field.includes(",") || field.includes("-")) {
		const values = parseField(field, 0, 59);
		switch (type) {
			case "minute":
				return `at minute ${values.join(", ")}`;
			case "hour":
				return `at hour ${values.join(", ")}`;
			case "dom":
				return `on day ${values.join(", ")}`;
			case "month":
				return values
					.map((v) => MONTH_NAMES[v - 1] || String(v))
					.join(", ");
			case "dow":
				return values
					.map((v) => DAY_NAMES[v] || String(v))
					.join(", ");
		}
	}

	const num = parseInt(field, 10);
	switch (type) {
		case "minute":
			return `at minute ${num}`;
		case "hour":
			return `at ${num}:00`;
		case "dom":
			return `on day ${num}`;
		case "month":
			return `in ${MONTH_NAMES[num - 1] || field}`;
		case "dow":
			return `on ${DAY_NAMES[num] || field}`;
	}
}

function getHumanReadable(expression: string): string {
	const parts = expression.trim().split(/\s+/);
	if (parts.length !== 5) return "Invalid cron expression (expected 5 fields)";

	const [minute, hour, dom, month, dow] = parts;

	const pieces: string[] = [];

	pieces.push(describeField(minute, "minute"));
	pieces.push(describeField(hour, "hour"));
	pieces.push(describeField(dom, "dom"));
	pieces.push(describeField(month, "month"));
	pieces.push(describeField(dow, "dow"));

	return pieces.join(", ");
}

function getFieldBreakdown(
	expression: string
): { field: string; value: string; meaning: string }[] {
	const parts = expression.trim().split(/\s+/);
	if (parts.length !== 5) return [];

	const fieldNames: Array<{
		name: string;
		type: "minute" | "hour" | "dom" | "month" | "dow";
	}> = [
		{ name: "Minute", type: "minute" },
		{ name: "Hour", type: "hour" },
		{ name: "Day of Month", type: "dom" },
		{ name: "Month", type: "month" },
		{ name: "Day of Week", type: "dow" },
	];

	return fieldNames.map((f, i) => ({
		field: f.name,
		value: parts[i],
		meaning: describeField(parts[i], f.type),
	}));
}

function matchesField(value: number, field: string): boolean {
	const values = parseFieldForMatch(field, value);
	return values.includes(value);
}

function parseFieldForMatch(field: string, _hint: number): number[] {
	// Determine appropriate min/max based on context is hard without type info,
	// so we parse broadly with 0-59 range for steps on *
	if (field === "*") return [-1]; // special: matches everything

	const stepMatch = field.match(/^\*\/(\d+)$/);
	if (stepMatch) {
		const step = parseInt(stepMatch[1], 10);
		const result: number[] = [];
		for (let i = 0; i < 60; i += step) {
			result.push(i);
		}
		return result;
	}

	const values: number[] = [];
	for (const part of field.split(",")) {
		if (part.includes("-")) {
			const [start, end] = part.split("-").map(Number);
			for (let i = start; i <= end; i++) {
				values.push(i);
			}
		} else {
			values.push(parseInt(part, 10));
		}
	}
	return values;
}

function matchesCron(date: Date, fields: string[]): boolean {
	const [minField, hourField, domField, monthField, dowField] = fields;

	const min = date.getMinutes();
	const hour = date.getHours();
	const dom = date.getDate();
	const month = date.getMonth() + 1;
	const dow = date.getDay();

	const check = (val: number, field: string): boolean => {
		const parsed = parseFieldForMatch(field, val);
		if (parsed.length === 1 && parsed[0] === -1) return true; // wildcard
		return parsed.includes(val);
	};

	return (
		check(min, minField) &&
		check(hour, hourField) &&
		check(dom, domField) &&
		check(month, monthField) &&
		check(dow, dowField)
	);
}

function getNextRunTimes(expression: string, count: number): Date[] {
	const parts = expression.trim().split(/\s+/);
	if (parts.length !== 5) return [];

	const results: Date[] = [];
	const now = new Date();
	const cursor = new Date(now);
	cursor.setSeconds(0, 0);
	cursor.setMinutes(cursor.getMinutes() + 1);

	const maxIterations = 525600; // one year of minutes
	let iterations = 0;

	while (results.length < count && iterations < maxIterations) {
		if (matchesCron(cursor, parts)) {
			results.push(new Date(cursor));
		}
		cursor.setMinutes(cursor.getMinutes() + 1);
		iterations++;
	}

	return results;
}

const CronParser: React.FC = () => {
	const [expression, setExpression] = useState("0 9 * * 1-5");
	const [description, setDescription] = useState("");
	const [nextRuns, setNextRuns] = useState<Date[]>([]);
	const [breakdown, setBreakdown] = useState<
		{ field: string; value: string; meaning: string }[]
	>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		parse(expression);
	}, []);

	const parse = (expr: string) => {
		const trimmed = expr.trim();
		const parts = trimmed.split(/\s+/);

		if (parts.length !== 5) {
			setError(
				"Invalid cron expression. Expected 5 fields: minute hour day-of-month month day-of-week"
			);
			setDescription("");
			setNextRuns([]);
			setBreakdown([]);
			return;
		}

		try {
			setError("");
			setDescription(getHumanReadable(trimmed));
			setBreakdown(getFieldBreakdown(trimmed));
			setNextRuns(getNextRunTimes(trimmed, 5));
		} catch (e) {
			setError((e as Error).message);
			setDescription("");
			setNextRuns([]);
			setBreakdown([]);
		}
	};

	const handleChange = (value: string) => {
		setExpression(value);
		parse(value);
	};

	const copyExpression = () => {
		navigator.clipboard.writeText(expression);
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
			<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
				<TextField
					fullWidth
					label="Cron Expression"
					value={expression}
					onChange={(e) => handleChange(e.target.value)}
					placeholder="* * * * *"
					InputProps={{
						sx: { fontFamily: "monospace", fontSize: 16 },
					}}
				/>
				<Button
					size="small"
					startIcon={<ContentCopyIcon />}
					onClick={copyExpression}
				>
					Copy
				</Button>
			</Stack>

			<Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
				{PRESETS.map((preset) => (
					<Chip
						key={preset.value}
						label={preset.label}
						onClick={() => handleChange(preset.value)}
						variant={
							expression === preset.value
								? "filled"
								: "outlined"
						}
						sx={{ mb: 1 }}
					/>
				))}
			</Stack>

			{error && (
				<OutlinedCard padding={2}>
					<Typography
						color="error"
						variant="body2"
						sx={{ fontFamily: "monospace" }}
					>
						{error}
					</Typography>
				</OutlinedCard>
			)}

			{description && (
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 1 }}
					>
						Human-Readable Description
					</Typography>
					<OutlinedCard padding={2}>
						<Typography variant="body1">{description}</Typography>
					</OutlinedCard>
				</Box>
			)}

			{breakdown.length > 0 && (
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 1 }}
					>
						Field Breakdown
					</Typography>
					<Paper variant="outlined">
						<Table size="small">
							<TableBody>
								{breakdown.map((row) => (
									<TableRow key={row.field}>
										<TableCell
											sx={{ fontWeight: "bold" }}
										>
											{row.field}
										</TableCell>
										<TableCell>
											<Typography
												component="code"
												sx={{
													fontFamily: "monospace",
													backgroundColor:
														"action.hover",
													px: 1,
													py: 0.5,
													borderRadius: 1,
												}}
											>
												{row.value}
											</Typography>
										</TableCell>
										<TableCell>{row.meaning}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</Box>
			)}

			{nextRuns.length > 0 && (
				<Box>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 1 }}
					>
						Next 5 Scheduled Run Times
					</Typography>
					<Paper variant="outlined">
						<Table size="small">
							<TableBody>
								{nextRuns.map((date, index) => (
									<TableRow key={index}>
										<TableCell sx={{ width: 30 }}>
											{index + 1}
										</TableCell>
										<TableCell
											sx={{
												fontFamily: "monospace",
											}}
										>
											{date.toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</Box>
			)}
		</Box>
	);
};

export default CronParser;
