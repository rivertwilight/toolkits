import React, { useState } from "react";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Select,
	MenuItem,
	Paper,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface Player {
	name: string;
	score: number;
}

interface Round {
	winner: number;
	amount: number;
	timestamp: number;
}

type GameMode = "texas" | "zhajinhua";

const ScoreCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	textAlign: "center",
	minHeight: 80,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
}));

const DEFAULT_NAMES = [
	"玩家 1",
	"玩家 2",
	"玩家 3",
	"玩家 4",
	"玩家 5",
	"玩家 6",
];

const CardGameScorer = () => {
	console.log("[CardGameScorer] component rendered");
	const [gameMode, setGameMode] = useState<GameMode>("texas");
	const [playerCount, setPlayerCount] = useState(4);
	const [players, setPlayers] = useState<Player[]>(
		DEFAULT_NAMES.slice(0, 4).map((name) => ({ name, score: 0 }))
	);
	const [rounds, setRounds] = useState<Round[]>([]);
	const [settled, setSettled] = useState(false);

	const [selectedWinner, setSelectedWinner] = useState<number>(-1);
	const [roundAmount, setRoundAmount] = useState<string>("");

	const [showSettlement, setShowSettlement] = useState(false);

	const handlePlayerCountChange = (count: number) => {
		setPlayerCount(count);
		setPlayers(
			DEFAULT_NAMES.slice(0, count).map((name, i) => ({
				name: players[i]?.name || name,
				score: 0,
			}))
		);
		setRounds([]);
		setSettled(false);
		setSelectedWinner(-1);
	};

	const handleNameChange = (index: number, name: string) => {
		setPlayers((prev) =>
			prev.map((p, i) => (i === index ? { ...p, name } : p))
		);
	};

	const handleAddRound = () => {
		const amount = Number(roundAmount);
		if (selectedWinner < 0 || !amount || amount <= 0) return;

		const lossPerPlayer = amount / (playerCount - 1);
		const newRound: Round = {
			winner: selectedWinner,
			amount,
			timestamp: Date.now(),
		};

		setPlayers((prev) =>
			prev.map((p, i) => ({
				...p,
				score:
					i === selectedWinner
						? p.score + amount
						: p.score - lossPerPlayer,
			}))
		);
		setRounds((prev) => [...prev, newRound]);
		setSelectedWinner(-1);
		setRoundAmount("");
	};

	const handleUndo = () => {
		if (rounds.length === 0) return;
		const lastRound = rounds[rounds.length - 1];
		const lossPerPlayer = lastRound.amount / (playerCount - 1);

		setPlayers((prev) =>
			prev.map((p, i) => ({
				...p,
				score:
					i === lastRound.winner
						? p.score - lastRound.amount
						: p.score + lossPerPlayer,
			}))
		);
		setRounds((prev) => prev.slice(0, -1));
	};

	const handleReset = () => {
		setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
		setRounds([]);
		setSettled(false);
		setShowSettlement(false);
		setSelectedWinner(-1);
		setRoundAmount("");
	};

	const handleSettle = () => {
		setSettled(true);
		setShowSettlement(true);
	};

	const formatScore = (score: number) => {
		const rounded = Math.round(score * 100) / 100;
		if (rounded > 0) return `+${rounded}`;
		return `${rounded}`;
	};

	return (
		<Container maxWidth="md">
			{/* Game Settings */}
			<Box
				display="flex"
				gap={2}
				mb={3}
				flexDirection={{ xs: "column", sm: "row" }}
			>
				<FormControl fullWidth size="small">
					<InputLabel>Game Mode</InputLabel>
					<Select
						value={gameMode}
						label="Game Mode"
						onChange={(e) =>
							setGameMode(e.target.value as GameMode)
						}
					>
						<MenuItem value="texas">Texas Hold'em</MenuItem>
						<MenuItem value="zhajinhua">Three Card Poker</MenuItem>
					</Select>
				</FormControl>
				<FormControl fullWidth size="small">
					<InputLabel>Players</InputLabel>
					<Select
						value={playerCount}
						label="Players"
						onChange={(e) =>
							handlePlayerCountChange(Number(e.target.value))
						}
					>
						{[2, 3, 4, 5, 6].map((n) => (
							<MenuItem key={n} value={n}>
								{n} Players
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Player Score Cards */}
			<Box
				display="grid"
				gridTemplateColumns={{
					xs: "repeat(2, 1fr)",
					sm: "repeat(3, 1fr)",
				}}
				gap={2}
				mb={3}
			>
				{players.map((player, index) => (
					<ScoreCard
						key={index}
						elevation={2}
						sx={{
							borderTop: 3,
							borderColor:
								player.score > 0
									? "success.main"
									: player.score < 0
										? "error.main"
										: "grey.400",
						}}
					>
						<TextField
							value={player.name}
							onChange={(e) =>
								handleNameChange(index, e.target.value)
							}
							variant="standard"
							slotProps={{
								htmlInput: {
									style: {
										textAlign: "center",
										fontWeight: "bold",
									},
								},
							}}
							sx={{ mb: 1 }}
						/>
						<Typography
							variant="h4"
							color={
								player.score > 0
									? "success.main"
									: player.score < 0
										? "error.main"
										: "text.primary"
							}
							fontWeight="bold"
						>
							{formatScore(player.score)}
						</Typography>
					</ScoreCard>
				))}
			</Box>

			{/* New Round Input */}
			{!settled && (
				<Paper elevation={1} sx={{ p: 2, mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						New Round
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						mb={1}
					>
						Winner:
					</Typography>
					<Box display="flex" gap={1} flexWrap="wrap" mb={2}>
						{players.map((player, index) => (
							<Chip
								key={index}
								label={player.name}
								color={
									selectedWinner === index
										? "primary"
										: "default"
								}
								onClick={() => setSelectedWinner(index)}
								variant={
									selectedWinner === index
										? "filled"
										: "outlined"
								}
							/>
						))}
					</Box>
					<Box display="flex" gap={2}>
						<TextField
							fullWidth
							size="small"
							label="Win Amount"
							type="number"
							value={roundAmount}
							onChange={(e) => setRoundAmount(e.target.value)}
							slotProps={{ htmlInput: { min: 0 } }}
						/>
						<Button
							variant="contained"
							onClick={handleAddRound}
							disabled={
								selectedWinner < 0 ||
								!roundAmount ||
								Number(roundAmount) <= 0
							}
							sx={{ minWidth: 100 }}
						>
							Confirm
						</Button>
					</Box>
				</Paper>
			)}

			{/* Action Buttons */}
			<Box display="flex" justifyContent="center" gap={2} mb={3}>
				<Button
					variant="outlined"
					onClick={handleUndo}
					disabled={rounds.length === 0}
				>
					Undo
				</Button>
				<Button
					variant="contained"
					color="success"
					onClick={handleSettle}
					disabled={rounds.length === 0}
				>
					Settle
				</Button>
				<Button variant="outlined" color="error" onClick={handleReset}>
					Reset
				</Button>
			</Box>

			{/* Round History */}
			{rounds.length > 0 && (
				<Paper elevation={1} sx={{ p: 2, mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						History ({rounds.length} rounds)
					</Typography>
					<List dense>
						{[...rounds].reverse().map((round, i) => (
							<React.Fragment key={round.timestamp}>
								{i > 0 && <Divider />}
								<ListItem>
									<ListItemText
										primary={`Round ${rounds.length - i}: ${players[round.winner]?.name} wins +${round.amount}`}
										secondary={`Others: ${formatScore(-round.amount / (playerCount - 1))} each`}
									/>
								</ListItem>
							</React.Fragment>
						))}
					</List>
				</Paper>
			)}

			{/* Settlement Dialog */}
			<Dialog
				open={showSettlement}
				onClose={() => setShowSettlement(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Settlement</DialogTitle>
				<DialogContent>
					<List>
						{[...players]
							.map((p, i) => ({ ...p, index: i }))
							.sort((a, b) => b.score - a.score)
							.map((player, i) => (
								<React.Fragment key={player.index}>
									{i > 0 && <Divider />}
									<ListItem>
										<ListItemText
											primary={
												<Box
													display="flex"
													justifyContent="space-between"
												>
													<Typography fontWeight="bold">
														{player.name}
													</Typography>
													<Typography
														fontWeight="bold"
														color={
															player.score > 0
																? "success.main"
																: player.score <
																	  0
																	? "error.main"
																	: "text.primary"
														}
													>
														{formatScore(
															player.score
														)}
													</Typography>
												</Box>
											}
										/>
									</ListItem>
								</React.Fragment>
							))}
					</List>
					<Typography
						variant="body2"
						color="text.secondary"
						align="center"
						mt={1}
					>
						{gameMode === "texas"
							? "Texas Hold'em"
							: "Three Card Poker"}{" "}
						| {playerCount} players | {rounds.length} rounds
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowSettlement(false)}>
						Close
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleReset}
					>
						New Game
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default CardGameScorer;
