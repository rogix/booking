import { useCallback } from "react";

export interface BookingFormData {
	name: string;
	email: string;
}

export interface BookingPayload {
	timeSlot: string;
	name: string;
	email: string;
}

export function useBookingPayload(
	selectedSlot: string | null,
	selectedDate?: Date,
) {
	const buildPayload = useCallback(
		(formData: BookingFormData): BookingPayload | null => {
			if (!selectedSlot || !selectedDate) {
				return null;
			}
			return {
				timeSlot: selectedSlot,
				name: formData.name.trim(),
				email: formData.email.trim(),
			};
		},
		[selectedSlot, selectedDate],
	);

	return { buildPayload };
}
