const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAvailableTimes = async (
	startDate: string,
	endDate: string,
	mockResponseName: string,
): Promise<string[]> => {
	console.log("mockResponseName", mockResponseName);
	const response = await fetch(
		`${API_BASE_URL}/appointment_availabilities/available_times?start_date_time=${startDate}&end_date_time=${endDate}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-mock-response-name": mockResponseName,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch: ${response.status} ${response.statusText}`,
		);
	}

	const jsonData = await response.json();
	return jsonData.data.available_times;
};
