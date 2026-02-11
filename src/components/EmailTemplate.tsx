import * as React from "react";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import ReactMarkdown from "react-markdown";

interface EmailTemplateProps {
	content: string;
	appName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	content,
	appName
}) => {
	const previewText = "New feedback from YGeeker product";

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>Feedback</Heading>
					<Section style={feedbackSection}>
						<ReactMarkdown
							components={{
								p: (props) => (
									<Text style={feedbackContent} {...props} />
								),
								h1: (props) => (
									<Heading style={mdHeading1} {...props} />
								),
								h2: (props) => (
									<Heading style={mdHeading2} {...props} />
								),
								h3: (props) => (
									<Heading style={mdHeading3} {...props} />
								),
								ul: (props) => <ul style={mdList} {...props} />,
								ol: (props) => <ol style={mdList} {...props} />,
								li: (props) => (
									<li style={mdListItem} {...props} />
								),
								blockquote: (props) => (
									<blockquote
										style={mdBlockquote}
										{...props}
									/>
								),
							}}
						>
							{content}
						</ReactMarkdown>
					</Section>
					<Text style={footer}>
						This email was sent from the Toolkits feedback system.
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

// Styles
const main = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "580px",
};

const h1 = {
	color: "#333",
	fontSize: "24px",
	fontWeight: "bold",
	padding: "17px 0 0",
	textAlign: "center" as const,
};

const feedbackSection = {
	background: "#ffffff",
	border: "1px solid #f0f0f0",
	borderRadius: "4px",
	margin: "16px 0",
	padding: "24px",
};

const feedbackContent = {
	color: "#525252",
	fontSize: "16px",
	lineHeight: "1.5",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
	lineHeight: "16px",
	textAlign: "center" as const,
};

const mdHeading1 = {
	fontSize: "22px",
	fontWeight: "bold",
	margin: "16px 0 8px",
};

const mdHeading2 = {
	fontSize: "20px",
	fontWeight: "bold",
	margin: "14px 0 7px",
};

const mdHeading3 = {
	fontSize: "18px",
	fontWeight: "bold",
	margin: "12px 0 6px",
};

const mdList = {
	marginLeft: "20px",
};

const mdListItem = {
	margin: "4px 0",
};

const mdBlockquote = {
	borderLeft: "4px solid #e0e0e0",
	margin: "16px 0",
	padding: "8px 16px",
	fontStyle: "italic",
};
