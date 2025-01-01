import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

async function enableMocking() {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	const { worker } = await import("./mocks/browser");

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start();
}

const rootElement = document.getElementById("root");

if (rootElement) {
	enableMocking().then(() => {
		createRoot(rootElement).render(
			<StrictMode>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</StrictMode>,
		);
	});
} else {
	console.error("Root element not found");
}
