import { useState, useEffect } from "react";
import { store as frameStore } from "@/utils/Data/frameState";

export function useFrameState(): boolean {
	const [framed, setFramed] = useState(true);
	useEffect(() => {
		const unsubscribe = frameStore.subscribe(() =>
			setFramed(frameStore.getState().value)
		);
		return () => unsubscribe();
	}, []);
	return framed;
}
