"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function NotFound() {
	return (
		<div className="center-with-flex">
			<Image
				alt="Illustration of a 404 page"
				height="200"
				width="200"
				src="/illustration/undraw_taken_re_yn20.svg"
			/>
			<Typography variant="h4">电波无法到达哦</Typography>
			<Typography variant="body1">
				想要的工具不见了？返回首页找找吧！
			</Typography>
			<br />
			<Link href="/">
				<Button variant="outlined">返回首页</Button>
			</Link>
		</div>
	);
}
