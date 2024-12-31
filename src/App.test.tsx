import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App component", () => {
	test("renders Hello text", () => {
		render(<App />);
		const helloText = screen.getByText("Hello");
		expect(helloText).toBeInTheDocument();
		expect(helloText).toHaveClass("text-yellow-700");
	});
});
