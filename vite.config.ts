import path from "node:path";
import { defineConfig as defineViteConfig, loadEnv, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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
	},
});

export default mergeConfig(viteConfig, vitestConfig);
