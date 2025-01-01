import axios from "axios";

// const API_BASE_URL = 'https://5b94bbb0-4b84-4173-8753-c9b46c84fc76.mock.pstmn.io';
const API_BASE_URL = "http://mymock.com";

export const fetchAvailableTimes = async (
	startDate: string,
	endDate: string,
	mockResponseName: string,
) => {
	const response = await axios.get(
		`${API_BASE_URL}/appointment_availabilities/available_times?start_date_time=${startDate}&end_date_time=${endDate}`,
		{
			headers: {
				"x-mock-response-name": mockResponseName,
			},
		},
	);
	return response.data.data.available_times;
};
