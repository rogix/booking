import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveSlotMutation() {
	const queryClient = useQueryClient();

	return useMutation<
		void,
		unknown,
		{ date: string; slot: string },
		{ previousSlots?: string[] }
	>({
		mutationFn: async () => {
			return Promise.resolve();
		},
		onMutate: async ({ slot }: { slot: string }) => {
			await queryClient.cancelQueries({ queryKey: ["availableTimes"] });

			const previousData =
				queryClient.getQueryData<string[]>(["availableTimes"]) || [];

			const updatedSlots = previousData.filter((s) => s !== slot);

			queryClient.setQueryData(["availableTimes"], updatedSlots);

			return { previousSlots: previousData };
		},
		onError: (_error, _variables, context) => {
			if (context?.previousSlots) {
				queryClient.setQueryData(["availableTimes"], context.previousSlots);
			}
		},
	});
}
