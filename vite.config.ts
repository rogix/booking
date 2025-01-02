import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";

process.env.TZ = "UTC";

const viteConfig = defineViteConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});

const vitestConfig = defineVitestConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/setupTests.ts"],
		coverage: {
			exclude: [
				"./public",
				"./src/tests",
				"./src/services/*",
				"./src/mocks/*",
				"./*",
			],
		},
	},
});

export default mergeConfig(viteConfig, vitestConfig);
