import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
	},
	build: {
		outDir: "build",
		sourcemap: false,
		chunkSizeWarningLimit: 1000,
	},
});
