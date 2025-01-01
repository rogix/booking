import { fetchAvailableTimes } from "@/services/api";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Calendar } from "./ScheduleCalendar";
import { ScheduleInfo } from "./ScheduleInfo";
import TimeSlotSelector from "./TimeSlotSelector";
import UserForm from "./UserForm";

export const handleDateFromURL = (dateString: string) => {
	const timeZone = "America/Sao_Paulo";
	const parsedDate = parseISO(dateString);
	const zonedDate = toZonedTime(parsedDate, timeZone);

	return zonedDate;
};

export function Scheduler() {
	const [timeSlotsByDay, setTimeSlotsByDay] = useState<Map<string, string[]>>(
		new Map(),
	);
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	const [formData, setFormData] = useState<{
		name: string;
		email: string;
	} | null>(null);

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const fetchSlots = async () => {
			const monthParam =
				searchParams.get("month") || currentMonth.toISOString().slice(0, 7);
			const dateParam = searchParams.get("date");

			const start_date_time = new Date(
				`${monthParam}-01T00:00:00Z`,
			).toISOString();

			const end_date_time = new Date(
				new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
			).toISOString();

			const mockResponseName = monthParam === "2024-12" ? "Dec2024" : "Jan2025";

			try {
				const slots = await fetchAvailableTimes(
					start_date_time,
					end_date_time,
					mockResponseName,
				);

				const groupedSlots = new Map<string, string[]>();
				for (const slot of slots) {
					const date = new Date(slot).toISOString().split("T")[0];
					if (!groupedSlots.has(date)) {
						groupedSlots.set(date, []);
					}
					const slotsForDate = groupedSlots.get(date);
					if (slotsForDate) {
						slotsForDate.push(slot);
					}
				}

				setTimeSlotsByDay(groupedSlots);

				if (dateParam) {
					setSelectedDate(handleDateFromURL(dateParam));
				}
			} catch (error) {
				console.error("Failed to fetch available times:", error);
			}
		};

		fetchSlots();
	}, [currentMonth, searchParams]);

	const handleDateSelect = (date: Date | null) => {
		if (date) {
			const timeZone = "America/Sao_Paulo";

			const zonedDate = toZonedTime(date, timeZone);

			const newMonth = format(zonedDate, "yyyy-MM");
			const newDate = format(zonedDate, "yyyy-MM-dd");

			setCurrentMonth(zonedDate);
			setSelectedDate(handleDateFromURL(newDate));

			navigate(`?month=${newMonth}&date=${newDate}`);
		}
	};

	const handleFormSubmit = async (data: { name: string; email: string }) => {
		if (!selectedSlot || !selectedDate) return;

		try {
			console.log({ timeSlot: selectedSlot, ...data });

			const selectedDay = format(selectedDate, "yyyy-MM-dd");
			const updatedSlots = new Map(timeSlotsByDay);

			const remainingSlots = updatedSlots
				.get(selectedDay)
				?.filter((s) => s !== selectedSlot);
			if (remainingSlots && remainingSlots.length > 0) {
				updatedSlots.set(selectedDay, remainingSlots);
			} else {
				updatedSlots.delete(selectedDay);
			}

			setTimeSlotsByDay(updatedSlots);
			setSelectedSlot(null);
			setFormData(data);
		} catch (error) {
			console.error("Failed to submit form:", error);
		}
	};

	const handleSlotSelection = (slot: string) => {
		setSelectedSlot(slot);
	};

	const slotsForSelectedDate = selectedDate
		? timeSlotsByDay.get(format(selectedDate, "yyyy-MM-dd")) || []
		: [];

	console.log("selectedDate", Boolean(selectedDate));

	const maxW = selectedDate
		? "max-w-[1060px] transition-all duration-700"
		: "max-w-[800px]";

	return (
		<div
			className={`flex flex-col h-screen justify-center ${maxW} min-w-[800px] mx-auto`}
		>
			<section className="flex w-full justify-between border mx-auto min-h-[85%] rounded-md shadow-xl overflow-auto">
				<ScheduleInfo />
				{selectedSlot ? (
					<UserForm onSubmit={handleFormSubmit} />
				) : (
					<div className="flex">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={handleDateSelect}
							className="rounded-md "
							bookableDates={Array.from(timeSlotsByDay.keys()).map(
								(date) => new Date(handleDateFromURL(date)),
							)}
							required
						/>
						<TimeSlotSelector
							timeSlots={slotsForSelectedDate}
							onSelect={handleSlotSelection}
						/>
					</div>
				)}
			</section>
		</div>
	);
}
