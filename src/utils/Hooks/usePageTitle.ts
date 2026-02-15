import { useEffect } from "react";
import { usePage } from "@/contexts/page";

export function usePageTitle(title: string) {
	const { setTitle } = usePage();
	useEffect(() => {
		setTitle(title);
		return () => setTitle("");
	}, [title, setTitle]);
}
