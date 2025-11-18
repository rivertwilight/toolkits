"use client";

import React, { useRef, useEffect, useMemo } from "react";
import Cropper from "react-cropper";
import { isSameOrigin } from "@/utils/checkOrigin";
import Text from "@/components/i18n";
import { useLocale } from "@/contexts/locale";

import "cropperjs/dist/cropper.css";

export default function CropperClient({
	currentPage,
	dic,
	locale,
}: {
	currentPage: any;
	dic: string;
	locale: string;
}) {
	const cropperRef = useRef(null);
	const [imgSrc, setImgSrc] = React.useState(null);
	const { locale: activeLocale } = useLocale();

	useEffect(() => {
		const receiveMessage = (event) => {
			if (!isSameOrigin(event.origin)) return;

			if (event.data.type === "SEND_RAW") {
				if (event.data.data instanceof File) {
					const reader = new FileReader();
					reader.onload = (e) => setImgSrc(e.target.result);
					reader.readAsDataURL(event.data.data);
				} else {
					setImgSrc(event.data.data);
				}
			} else if (event.data.type === "REQUEST_RESULT") {
				const cropper = cropperRef.current?.cropper;
				if (cropper) {
					const croppedImageURI = cropper
						.getCroppedCanvas()
						.toDataURL();
					window.parent.postMessage(
						{ type: "SEND_RESULT", data: croppedImageURI },
						"*"
					);
				}
			}
		};

		window.addEventListener("message", receiveMessage, false);
		window.parent.postMessage({ type: "ready" }, "*");

		return () => window.removeEventListener("message", receiveMessage);
	}, []);

	const localizedDic = useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<Text dictionary={localizedDic || {}} language={activeLocale}>
			{imgSrc && (
				<Cropper
					ref={cropperRef}
					src={imgSrc}
					style={{ height: "100%", width: "100%" }}
					aspectRatio={1}
					guides={true}
					viewMode={1}
					background={false}
				/>
			)}
		</Text>
	);
}
