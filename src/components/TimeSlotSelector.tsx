import { format } from "date-fns";
import { useState } from "react";
import { handleDateFromURL } from "./scheduler";
import { Button } from "./ui/button";

interface TimeSlotSelectorProps {
	timeSlots: string[];
	onSelect: (timeSlot: string) => void;
	selectedDate: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
	timeSlots,
	onSelect,
	selectedDate,
}) => {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	return timeSlots.length ? (
		<div className="px-5 mt-20 w-72 overflow-hidden">
			<h2 className="font-normal mb-8">
				{format(handleDateFromURL(selectedDate), "EEEE, MMMM d")}
			</h2>
			<ul className="flex flex-col gap-2">
				{timeSlots.map((slot, index) => (
					<li
						key={slot}
						onClick={() => {
							setSelectedIndex(index);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedIndex(index);
							}
						}}
					>
						<div className="flex justify-between gap-2">
							<Button
								variant="outline"
								className={`flex-1 border-primary/50 text-primary hover:bg-transparent text-md font-bold ${
									selectedIndex === index
										? "bg-accent text-primary-foreground cursor-default animate-shrink"
										: ""
								}`}
								size="lg"
							>
								{format(new Date(slot), "HH:mm")}
							</Button>
							{selectedIndex === index && (
								<Button
									variant="outline"
									size="lg"
									className="w-full flex-1 animate-slide-in-right font-bold text-md opacity-100 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
									onClick={() => {
										onSelect(slot);
										setSelectedIndex(null);
									}}
								>
									Next
								</Button>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	) : (
		""
	);
};

export default TimeSlotSelector;
