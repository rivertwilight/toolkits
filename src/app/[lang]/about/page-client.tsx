"use client";

import { useEffect, useState } from "react";
import OutlinedCard from "../../../components/OutlinedCard";
import { styled } from "@mui/material/styles";
import StyledMarkdown from "../../../components/StyledMarkdown";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import MailIcon from "@mui/icons-material/Mail";
import { author, repo } from "../../../site.config";
import packageInfo from "../../../../package.json";
import { useLocale } from "@/contexts/locale";
import { usePageTitle } from "@/utils/Hooks/usePageTitle";

const PREFIX = "about";

const classes = {
	authorName: `${PREFIX}-authorName`,
	avatar: `${PREFIX}-avatar`,
	contactGroup: `${PREFIX}-contactGroup`,
	authorCard: `${PREFIX}-authorCard`,
};

const Root = styled("div")(({ theme: Theme }) => ({
	maxWidth: "864px",
	margin: "180px auto 0 auto",
	padding: `${Theme.spacing(2)}`,
	paddingBottom: "50px",
	[`& .${classes.authorName}`]: {
		transform: "translateY(-10px)",
	},

	[`& .${classes.avatar}`]: {
		transform: "translateY(-50%)",
		marginLeft: "calc(50% - 50px)",
		boxShadow: "0px 0px 4px 4px rgb(0 0 0 / 10%)",
	},

	[`& .${classes.contactGroup}`]: {
		display: "flex",
		justifyContent: "center",
		paddingBottom: "10px",
	},

	[`& .${classes.authorCard}`]: {
		marginTop: 80,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
}));

export default function AboutClient({
	currentPage,
}: {
	currentPage: any;
}) {
	const { locale: activeLocale } = useLocale();
	const [content, setContent] = useState("");

	usePageTitle(currentPage.title);

	useEffect(() => {
		fetch(`/data/article/${activeLocale}/about.md`)
			.then((res) => res.text())
			.then((res) => {
				setContent(res);
			});
	}, [activeLocale]);

	return (
		<Root>
			<OutlinedCard className={classes.authorCard}>
				<Avatar
					className={classes.avatar}
					alt="Remy Sharp"
					src="https://avatars.githubusercontent.com/u/52880665?v=4"
					sx={{ width: 100, height: 100 }}
				/>
				<div className={classes.authorName}>
					<Typography align="center" variant="subtitle2">
						Developed and designed by{" "}
					</Typography>
					<Typography align="center" variant="h6">
						RiverTwilight
					</Typography>
				</div>

				<div className={classes.contactGroup}>
					<IconButton href={repo} aria-label="github">
						<GitHubIcon />
					</IconButton>
					{author.twitter && (
						<IconButton
							href={author.twitter}
							aria-label="Go to author's X profile"
						>
							<TwitterIcon />
						</IconButton>
					)}
					{author.email && (
						<IconButton
							href={`maileto://${author.email}`}
							aria-label="Send an email to me"
						>
							<MailIcon />
						</IconButton>
					)}
				</div>
			</OutlinedCard>
			<br />
			<OutlinedCard padding={2}>
				<StyledMarkdown content={content} />
			</OutlinedCard>
			<Typography align="center" color="GrayText" variant="subtitle1">
				Version: {packageInfo.version}
			</Typography>
		</Root>
	);
}
