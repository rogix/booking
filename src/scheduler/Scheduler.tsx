import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { Calendar } from "@/components/ScheduleCalendar";
import { ScheduleInfo } from "@/components/ScheduleInfo";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import UserForm from "@/components/UserForm";

import {
	type BookingFormData,
	useBookingPayload,
} from "./hooks/useBookingPayload";
import { useRemoveSlotMutation } from "./hooks/useRemoveSlotMutation";
import { useTimeSlots } from "./hooks/useTimeSlots";
import { getMockResponseName } from "./utils/getMockResponseName";
import { handleDateFromURL } from "./utils/handleDateFromURL";

export function Scheduler() {
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const monthParam = searchParams.get("month") ?? format(new Date(), "yyyy-MM");
	const dateParam = searchParams.get("date");

	const selectedDateToDisplay = dateParam
		? handleDateFromURL(dateParam)
		: selectedDate;

	const startDateTime = `${monthParam}-01T00:00:00Z`;
	const endDateTime = new Date(
		currentMonth.getFullYear(),
		currentMonth.getMonth() + 1,
		0,
	).toISOString();

	const mockResponseName = useMemo(
		() => getMockResponseName(monthParam),
		[monthParam],
	);

	const { timeSlotsByDay, isLoading, isError } = useTimeSlots(
		startDateTime,
		endDateTime,
		mockResponseName,
	);

	const removeSlotMutation = useRemoveSlotMutation();

	const { buildPayload } = useBookingPayload(
		selectedSlot,
		selectedDateToDisplay,
	);

	function handleDateSelect(date: Date | null) {
		if (!date) return;

		const zonedDate = toZonedTime(date, "UTC");
		setCurrentMonth(zonedDate);
		setSelectedDate(zonedDate);

		const newMonth = format(zonedDate, "yyyy-MM");
		const newDate = format(zonedDate, "yyyy-MM-dd");
		navigate(`?month=${newMonth}&date=${newDate}`);
	}

	const slotsForSelectedDate = useMemo(() => {
		if (!selectedDateToDisplay) return [];
		const dateKey = format(selectedDateToDisplay, "yyyy-MM-dd");
		return timeSlotsByDay.get(dateKey) || [];
	}, [timeSlotsByDay, selectedDateToDisplay]);

	const bookableDates = Array.from(timeSlotsByDay.keys()).map(
		(date) => new Date(handleDateFromURL(date)),
	);

	const selectedDateString = selectedDateToDisplay
		? format(selectedDateToDisplay, "yyyy-MM-dd")
		: "";

	const maxWidthClass = selectedDateToDisplay
		? "max-w-[1060px] transition-all duration-700"
		: "max-w-[800px]";

	async function handleFormSubmit(data: BookingFormData) {
		if (!selectedSlot || !selectedDateToDisplay) return;

		try {
			const payload = buildPayload(data);
			if (!payload) return;

			const selectedDay = format(selectedDateToDisplay, "yyyy-MM-dd");
			removeSlotMutation.mutate({ date: selectedDay, slot: payload.timeSlot });

			console.log("Payload:", payload);

			setSelectedSlot(null);
		} catch (error) {
			console.error("Failed to submit form:", error);
		}
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center my-8">
				<p className="text-red-500 mt-4">Failed to load data</p>
			</div>
		);
	}

	return (
		<div
			className={`flex flex-col md:p-10 lg:p-0 lg:h-screen justify-center ${maxWidthClass} lg:min-w-[800px] mx-auto`}
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
							className={isLoading ? "opacity-50 animate-pulse" : ""}
							isDaySelected={selectedDateToDisplay ? () => true : undefined}
							onSelect={handleDateSelect}
							bookableDates={bookableDates}
							onMonthChange={(newMonth) => {
								const zonedDate = toZonedTime(newMonth, "UTC");
								setCurrentMonth(zonedDate);

								setSelectedDate(undefined);

								navigate(`?month=${format(zonedDate, "yyyy-MM")}`);
							}}
							currentMonth={currentMonth}
							required
						/>

						<TimeSlotSelector
							selectedDate={selectedDateString}
							timeSlots={slotsForSelectedDate}
							onSelect={setSelectedSlot}
						/>
					</div>
				)}
			</section>
		</div>
	);
}
