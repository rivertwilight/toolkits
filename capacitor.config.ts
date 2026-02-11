/// <reference types="@capacitor/browser" />
/// <reference types="@capacitor/preferences" />

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.ygeeker.geekits",
	appName: "Toolkits",
	webDir: "out",
	server: {
		androidScheme: "https",
		errorPath: "/500.html",
	},
	plugins: {
		Browser: {
			presentationStyle: 'popover'
		},
		Preferences: {
			// You can add any Preferences-specific configuration here if needed
		},
		App: {
			// Enable system theme detection
			enableSystemThemeDetection: true
		}
	},
};

export default config;
