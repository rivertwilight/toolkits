import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

interface Page {
	title: string;
	setTitle: Dispatch<SetStateAction<string>>;
}

const PageContext = createContext<Page>({
	title: "",
	setTitle: () => {},
});

export const usePage = () => useContext(PageContext);

export const PageProvider = PageContext.Provider;
