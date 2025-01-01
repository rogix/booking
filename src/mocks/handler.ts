import { http, HttpResponse } from "msw";
import data from "./data.json";

const API_BASE_URL = "http://mymock.com";

export const handlers = [
	http.get(
		`${API_BASE_URL}/appointment_availabilities/available_times`,
		({ request }) => {
			const url = new URL(request.url);
			const startDateTime = url.searchParams.get("start_date_time");
			const endDateTime = url.searchParams.get("end_date_time");

			const mockData = {
				...data,
			};

			const filteredTimes = mockData.data.available_times.filter((time) => {
				const timeDate = new Date(time);
				return (
					(!startDateTime || timeDate >= new Date(startDateTime)) &&
					(!endDateTime || timeDate <= new Date(endDateTime))
				);
			});

			return HttpResponse.json({
				data: {
					available_times: filteredTimes,
				},
			});
		},
	),
];
