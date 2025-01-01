import { format } from "date-fns";
import { useState } from "react";
import { Button } from "./ui/button";

interface TimeSlotSelectorProps {
	timeSlots: string[];
	onSelect: (timeSlot: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
	timeSlots,
	onSelect,
}) => {
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

	return timeSlots.length ? (
		<div className="px-5 mt-20 w-80 overflow-hidden">
			<h2 className="font-normal mb-8">Wednesday, January 2</h2>
			<ul className="flex flex-col gap-2">
				{timeSlots.map((slot) => (
					<li
						key={slot}
						onClick={() => {
							setSelectedSlot(slot);
							onSelect(slot);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedSlot(slot);
								onSelect(slot);
							}
						}}
						style={{
							cursor: "pointer",
							background: selectedSlot === slot ? "lightblue" : "white",
						}}
					>
						<Button variant="outline" className="w-full">
							{format(new Date(slot), "hh:mm:ss a")}
						</Button>
					</li>
				))}
			</ul>
		</div>
	) : (
		""
	);
};

export default TimeSlotSelector;
