import UserForm from "@/components/UserForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("UserForm", () => {
	it("renders name and email input fields", () => {
		render(<UserForm onSubmit={vi.fn()} />);

		expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

		const submitButton = screen.getByRole("button", {
			name: /schedule event/i,
		});
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toBeDisabled();
	});

	it("disable submit button when fields are empty", async () => {
		render(<UserForm onSubmit={vi.fn()} />);

		const submitButton = screen.getByRole("button", {
			name: /schedule event/i,
		});

		userEvent.type(screen.getByLabelText(/name/i), " ");
		userEvent.type(screen.getByLabelText(/email/i), " ");

		expect(submitButton).toBeDisabled();
	});

	it("shows error message for invalid email", async () => {
		render(<UserForm onSubmit={vi.fn()} />);

		const nameInput = screen.getByLabelText(/name/i);
		const emailInput = screen.getByLabelText(/email/i);
		const submitButton = screen.getByRole("button", {
			name: /schedule event/i,
		});

		await userEvent.type(nameInput, "John Doe");
		await userEvent.type(emailInput, "invalid-email");

		expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();

		expect(submitButton).toBeDisabled();
	});

	it("submits the form when fields are valid", async () => {
		const mockOnSubmit = vi.fn();
		render(<UserForm onSubmit={mockOnSubmit} />);

		const nameInput = screen.getByLabelText(/name/i);
		const emailInput = screen.getByLabelText(/email/i);
		const submitButton = screen.getByRole("button", {
			name: /schedule event/i,
		});

		await userEvent.type(nameInput, "John Doe");
		await userEvent.type(emailInput, "john@example.com");

		expect(submitButton).not.toBeDisabled();

		await userEvent.click(submitButton);

		expect(mockOnSubmit).toHaveBeenCalledWith({
			name: "John Doe",
			email: "john@example.com",
		});
	});
});
