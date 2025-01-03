import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import React from "react";
import { useNavigate, useSearchParams } from "react-router";

import { Calendar } from "@/components/ScheduleCalendar";
import { ScheduleInfo } from "@/components/ScheduleInfo";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import UserForm from "@/components/UserForm";
import { useRemoveSlotMutation } from "./hooks/useRemoveSlotMutation";
import { useTimeSlots } from "./hooks/useTimeSlots";
import { handleDateFromURL } from "./utils/handleDateFromURL";

export function Scheduler() {
	const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
	const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

	// const [formData, setFormData] = React.useState<{
	// 	name: string;
	// 	email: string;
	// } | null>(null);

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const monthParam = searchParams.get("month") ?? format(new Date(), "yyyy-MM");

	const startDateTime = new Date(`${monthParam}-01T00:00:00Z`).toISOString();

	const endDateTime = new Date(
		new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
	).toISOString();

	const { timeSlotsByDay, isLoading, isError } = useTimeSlots(
		startDateTime,
		endDateTime,
		monthParam,
	);

	const dateParam = searchParams.get("date");
	const selectedDateToDisplay = dateParam
		? handleDateFromURL(dateParam)
		: selectedDate;

	const removeSlotMutation = useRemoveSlotMutation();

	const handleDateSelect = (date: Date | null) => {
		if (!date) return;

		const timeZone = "UTC";
		const zonedDate = toZonedTime(date, timeZone);

		const newMonth = format(zonedDate, "yyyy-MM");
		const newDate = format(zonedDate, "yyyy-MM-dd");

		setCurrentMonth(zonedDate);
		setSelectedDate(zonedDate);

		navigate(`?month=${newMonth}&date=${newDate}`);
	};

	const handleFormSubmit = async (data: { name: string; email: string }) => {
		if (!selectedSlot || !selectedDateToDisplay) return;

		try {
			const selectedDay = format(selectedDateToDisplay, "yyyy-MM-dd");
			console.log({ timeSlot: selectedSlot, ...data });

			removeSlotMutation.mutate({ date: selectedDay, slot: selectedSlot });

			setSelectedSlot(null);
			setFormData(data);
		} catch (error) {
			console.error("Failed to submit form:", error);
		}
	};

	const handleSlotSelection = (slot: string) => {
		setSelectedSlot(slot);
	};

	const slotsForSelectedDate = React.useMemo(() => {
		if (!selectedDateToDisplay) return [];
		const dateKey = format(selectedDateToDisplay, "yyyy-MM-dd");
		return timeSlotsByDay.get(dateKey) || [];
	}, [timeSlotsByDay, selectedDateToDisplay]);

	if (isLoading) {
		return <div>Loading available times...</div>;
	}
	if (isError) {
		return <div>Failed to load available times.</div>;
	}

	const maxW = selectedDateToDisplay
		? "max-w-[1060px] transition-all duration-700"
		: "max-w-[800px]";

	return (
		<div
			className={`flex flex-col md:p-10 lg:p-0 lg:h-screen justify-center ${maxW} lg:min-w-[800px] mx-auto`}
		>
			<section className="flex flex-col lg:flex-row w-full justify-between md:border mx-auto lg:min-h-[85%] rounded-md md:shadow-xl overflow-auto">
				<ScheduleInfo />

				{selectedSlot ? (
					<UserForm onSubmit={handleFormSubmit} />
				) : (
					<div className="flex justify-center p-5 lg:p-0">
						<Calendar
							mode="single"
							selected={selectedDateToDisplay}
							isDaySelected={selectedDateToDisplay ? () => true : undefined}
							onSelect={handleDateSelect}
							bookableDates={Array.from(timeSlotsByDay.keys()).map(
								(date) => new Date(handleDateFromURL(date as string)),
							)}
							required
						/>

						<TimeSlotSelector
							selectedDate={
								selectedDateToDisplay
									? format(selectedDateToDisplay, "yyyy-MM-dd")
									: ""
							}
							timeSlots={slotsForSelectedDate}
							onSelect={handleSlotSelection}
						/>
					</div>
				)}
			</section>
		</div>
	);
}
