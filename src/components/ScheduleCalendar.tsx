import { cn } from "@/lib/utils";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { buttonVariants } from "./ui/button";

type CalendarProps = DayPickerProps & {
	bookableDates?: Date[];
	isDaySelected?: (date: Date) => boolean;
	onMonthChange?: (newMonth: Date) => void;
	currentMonth?: Date;
};

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	isDaySelected,
	bookableDates,
	onMonthChange: externalMonthChange,
	currentMonth,
	...props
}: CalendarProps) {
	const handleDisabled = (date: Date) => {
		return !bookableDates?.some(
			(bookableDate) => bookableDate.toDateString() === date.toDateString(),
		);
	};

	function handleMonthChange(newMonth: Date) {
		if (externalMonthChange) {
			externalMonthChange(newMonth);
		}
	}

	return (
		<div className={`p-5 mx-auto ${isDaySelected ? "hidden md:block" : ""}`}>
			<h1 className="text-xl font-bold text-accent-foreground pb-5">
				Select a Date and Time
			</h1>

			<DayPicker
				className={cn("p-0", className)}
				onMonthChange={handleMonthChange}
				modifiers={{
					bookable: bookableDates,
				}}
				disabled={handleDisabled}
				classNames={{
					months: "flex flex-col",
					month: "justify-center",
					caption: "flex justify-center pt-1 relative items-center",
					month_caption: "text-sm font-medium text-center",
					nav: "space-x-1 flex items-center justify-around -mx-10 -mb-8 relative",
					button_previous: cn(
						buttonVariants({ variant: "ghost" }),
						"h-11 w-11 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-primary/10 rounded-full text-primary",
					),
					button_next: cn(
						buttonVariants({ variant: "ghost" }),
						"h-11 w-11 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-primary/10 rounded-full text-primary",
					),
					month_grid: "mx-auto mt-10 border-collapse",
					weekdays: "flex justify-between",
					weekday:
						"text-muted-foreground rounded-md uppercase w-11 font-normal text-[0.8rem]",
					week: "flex w-full mt-2 justify-center",
					day: cn(
						buttonVariants({ variant: "ghost" }),
						"h-11 w-11 m-1 font-bold aria-selected:bg-primary text-blue-500 rounded-full bg-primary/10 hover:bg-primary/10 hover:text-primary",
					),
					range_end: "day-range-end",
					selected:
						"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
					today:
						"text-blue-500 bg-primary/20 hover:bg-pimary/10 hover:text-primary",
					outside:
						"day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
					disabled:
						"text-gray-500 bg-transparent font-normal hover:bg-transparent hover:text-gray-500",
					range_middle:
						"aria-selected:bg-accent aria-selected:text-accent-foreground",
					hidden: "invisible",
					chevron: "dropdown_icon",
					months_dropdown: "dropdown_month",
					years_dropdown: "dropdown_year",
					weeks:
						"weeks flex flex-col items-center justify-center w-full mx-auto",
					footer: "footer",
					week_number: "week_number",
					...classNames,
				}}
				{...props}
			/>
		</div>
	);
}

Calendar.displayName = "Calendar";

export { Calendar };
