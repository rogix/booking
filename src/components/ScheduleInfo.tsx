import logo from "@/assets/image-logo.png";
import organizer from "@/assets/organizer.jpg";
import { ArrowLeft, Clock, Video } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

export function ScheduleInfo() {
	const navigate = useNavigate();
	const location = useLocation();

	const isNotHome = location.search.includes("month");

	return (
		<div className="flex flex-col justify-between gap-4 border-r min-w-[400px] relative">
			<div className="absolute top-0 left-0 p-5">
				{isNotHome && (
					<button
						type="button"
						className="text-primary border rounded-full p-2"
						onClick={() => {
							navigate("/");
							window.location.reload();
						}}
					>
						<ArrowLeft strokeWidth={2.75} />
					</button>
				)}
			</div>
			<div className="border-b w-full flex items-center justify-center p-7">
				<img src={logo} alt="Company" width={120} />
			</div>
			<div className="flex flex-col gap-2 py-2 px-7 justify-start items-baseline flex-1">
				<img
					src={organizer}
					alt="Organizer"
					width={65}
					className="rounded-full"
				/>
				<div className="flex flex-col">
					<span className="text-accent text-base font-bold font-sans">
						Arvind Menon
					</span>
					<h2 className="text-[28px] leading-8 font-bold text-[#0A2540] pb-5">
						30 Minute Interview
					</h2>
				</div>
				<div className="text-accent text-base font-semibold flex gap-2 pb-2">
					<Clock />
					30 min
				</div>
				<div className="text-accent text-base font-semibold flex gap-2">
					<Video />
					Web conferencing details provided upon confirmation.
				</div>
			</div>
			<section className="flex justify-between w-full p-5">
				<span>Cooking settings</span>
				<span>Report abuse</span>
			</section>
		</div>
	);
}
