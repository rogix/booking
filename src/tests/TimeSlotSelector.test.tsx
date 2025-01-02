import TimeSlotSelector from "@/components/TimeSlotSelector";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockDateISO = "2025-01-05";
const mockSlots = [
	"2025-01-05T09:00:00Z",
	"2025-01-05T10:30:00Z",
	"2025-01-05T11:45:00Z",
];

describe("TimeSlotSelector Component", () => {
	it("renders an empty string when no timeSlots are provided", () => {
		render(
			<TimeSlotSelector
				timeSlots={[]}
				onSelect={vi.fn()}
				selectedDate={mockDateISO}
			/>,
		);

		expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
		expect(document.body).toHaveTextContent(/^$/);
	});

	it("renders time slots and date heading when slots are provided", () => {
		render(
			<TimeSlotSelector
				timeSlots={mockSlots}
				onSelect={vi.fn()}
				selectedDate={mockDateISO}
			/>,
		);

		const headingRegex = /(saturday|sunday), january 5/i;
		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			headingRegex,
		);

		expect(screen.getByRole("button", { name: /09:00/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /10:30/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /11:45/i })).toBeInTheDocument();

		expect(
			screen.queryByRole("button", { name: /next/i }),
		).not.toBeInTheDocument();
	});

	it("allows selecting a slot and shows the Next button, then calls onSelect on Next", async () => {
		const user = userEvent.setup();
		const mockOnSelect = vi.fn();

		render(
			<TimeSlotSelector
				timeSlots={mockSlots}
				onSelect={mockOnSelect}
				selectedDate={mockDateISO}
			/>,
		);

		const slotButton = screen.getByRole("button", { name: /10:30/i });
		await user.click(slotButton);

		const nextButton = screen.getByRole("button", { name: /next/i });
		expect(nextButton).toBeInTheDocument();

		await user.click(nextButton);

		expect(mockOnSelect).toHaveBeenCalledTimes(1);
		expect(mockOnSelect).toHaveBeenCalledWith("2025-01-05T10:30:00Z");
	});

	it("allows selection by keyboard (Enter or Space)", async () => {
		const user = userEvent.setup();
		const mockOnSelect = vi.fn();

		render(
			<TimeSlotSelector
				timeSlots={mockSlots}
				onSelect={mockOnSelect}
				selectedDate={mockDateISO}
			/>,
		);

		const listItems = screen.getAllByRole("listitem");
		expect(listItems).toHaveLength(mockSlots.length);

		const firstLi = listItems[0];

		await user.tab();

		await user.keyboard("[Enter]");

		const nextButton = within(firstLi).getByRole("button", { name: /next/i });
		expect(nextButton).toBeInTheDocument();

		await user.click(nextButton);

		expect(mockOnSelect).toHaveBeenCalledWith("2025-01-05T09:00:00Z");
	});
});
