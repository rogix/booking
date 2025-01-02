import { fetchAvailableTimes } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const useTimeSlots = (
	startDateTime: string,
	endDateTime: string,
	monthParam: string,
) => {
	const mockResponseName = monthParam === "2024-12" ? "Dec2024" : "Jan2025";

	const {
		data: slots = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["availableTimes", startDateTime, endDateTime, mockResponseName],
		queryFn: () =>
			fetchAvailableTimes(startDateTime, endDateTime, mockResponseName),
	});

	const timeSlotsByDay = React.useMemo(() => {
		const grouped = new Map<string, string[]>();
		for (const slot of slots) {
			const date = new Date(slot).toISOString().split("T")[0];
			if (!grouped.has(date)) {
				grouped.set(date, []);
			}
			grouped.get(date)?.push(slot);
		}
		return grouped;
	}, [slots]);

	return { timeSlotsByDay, isLoading, isError };
};