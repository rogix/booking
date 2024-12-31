import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App component", () => {
	test("renders Vite and React logos", () => {
		render(<App />);
		const viteLogo = screen.getByAltText("Vite logo");
		const reactLogo = screen.getByAltText("React logo");
		expect(viteLogo).toBeInTheDocument();
		expect(reactLogo).toBeInTheDocument();
	});

	test("renders Vite + React heading", () => {
		render(<App />);
		const heading = screen.getByText("Vite + React");
		expect(heading).toBeInTheDocument();
	});

	test("renders initial count", () => {
		render(<App />);
		const button = screen.getByRole("button", { name: /count is 0/i });
		expect(button).toBeInTheDocument();
	});

	test("increments count on button click", () => {
		render(<App />);
		const button = screen.getByRole("button", { name: /count is 0/i });
		fireEvent.click(button);
		expect(button).toHaveTextContent("count is 1");
	});
});
