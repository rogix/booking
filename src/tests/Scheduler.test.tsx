import { describe, test, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Scheduler } from "@/scheduler/Scheduler";

function Wrapper({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>{children}</MemoryRouter>
		</QueryClientProvider>
	);
}

describe("Scheduler Integration Tests", () => {
	test("displays loading state initially, then renders time slots (from MSW)", async () => {
		render(<Scheduler />, { wrapper: Wrapper });

		expect(screen.getByText(/loading available times/i)).toBeInTheDocument();

		await waitFor(() =>
			expect(
				screen.queryByText(/loading available times/i),
			).not.toBeInTheDocument(),
		);

		expect(
			screen.getByRole("heading", { name: /select a date and time/i }),
		).toBeInTheDocument();
	});
});
