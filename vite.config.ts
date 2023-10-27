/// <reference types="vitest" />
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [glsl()],
	test: {
		setupFiles: ["./vitest.setup.ts"],
		environment: "jsdom"
	}
});
