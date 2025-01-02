import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const handleDateFromURL = (dateString: string): Date => {
	const timeZone = "UTC";
	const parsedDate = parseISO(dateString);
	return toZonedTime(parsedDate, timeZone);
};
