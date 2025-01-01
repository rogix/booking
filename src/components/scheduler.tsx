import { Calendar } from "./ScheduleCalendar";
import { ScheduleInfo } from "./ScheduleInfo";

export function Scheduler() {
	return (
		<div className="flex flex-col h-screen justify-center w-[800px] mx-auto">
			<section className="grid grid-cols-2 justify-center border mx-auto min-h-[85%] rounded-md shadow-xl">
				<ScheduleInfo />
				<Calendar />
			</section>
		</div>
	);
}
