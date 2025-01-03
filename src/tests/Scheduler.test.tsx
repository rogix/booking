import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { Scheduler } from "@/scheduler/Scheduler";
import userEvent from "@testing-library/user-event";

describe("Scheduler Integration Tests", () => {
	const setup = () => {
		const queryClient = new QueryClient();
		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<Scheduler />
				</MemoryRouter>
			</QueryClientProvider>,
		);
	};

	it("renders the calendar and timeslots", async () => {
		setup();

		expect(
			screen.getByRole("heading", { name: /select a date and time/i }),
		).toBeInTheDocument();
	});

	it("shows time slots for a day when the user clicks on that date in the calendar", async () => {
		setup();
		const user = userEvent.setup();

		const day6Button = screen.getByRole("button", {
			name: /monday, january 6th, 2025/i,
		});

		expect(day6Button).toBeInTheDocument();

		await user.click(day6Button);

		expect(screen.getByRole("button", { name: /18:00/i })).toBeInTheDocument();
	});

	it("allows selecting a time slot, then displays the UserForm", async () => {
		setup();
		const user = userEvent.setup();

		const day6Button = screen.getByRole("button", {
			name: /monday, january 6th, 2025/i,
		});
		await user.click(day6Button);

		const slotButton = screen.getByRole("button", { name: /18:00/i });
		await user.click(slotButton);

		const nextButton = screen.getByRole("button", { name: /^next$/i });

		expect(nextButton).toBeInTheDocument();

		await user.click(nextButton);

		const header = screen.getByRole("heading", { name: /enter details/i });

		expect(header).toBeInTheDocument();
	});

	it("submits the form with user data, calls removeSlot mutation, and resets selected slot", async () => {
		setup();
		const user = userEvent.setup();

		const day6Button = screen.getByRole("button", {
			name: /monday, january 6th, 2025/i,
		});
		await user.click(day6Button);

		const slotButton = await screen.findByRole("button", { name: /18:00/i });
		await user.click(slotButton);

		const nextButton = screen.getByRole("button", { name: /^next$/i });
		await user.click(nextButton);

		const nameInput = screen.getByLabelText(/name/i);
		const emailInput = screen.getByLabelText(/email/i);

		await user.type(nameInput, "John Doe");
		await user.type(emailInput, "john@example.com");

		const submitButton = screen.getByRole("button", {
			name: /schedule event/i,
		});

		await waitFor(() => {
			expect(submitButton).toBeEnabled();
		});

		await user.click(submitButton);

		await waitFor(() =>
			expect(
				screen.queryByRole("heading", { name: /enter details/i }),
			).not.toBeInTheDocument(),
		);
	});
});
