export function getMockResponseName(monthParam: string): string {
	switch (monthParam) {
		case "2024-12":
			return "Dec2024";
		case "2025-01":
			return "Jan2025";
		case "2025-02":
			return "Feb2025";
		default:
			return "Default";
	}
}
