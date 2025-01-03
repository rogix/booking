import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import { Scheduler } from "./scheduler/Scheduler";

const queryClient = new QueryClient();

const App: React.FC = () => {
	return (
		<div>
			<QueryClientProvider client={queryClient}>
				<Scheduler />
				<Toaster />
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</QueryClientProvider>
		</div>
	);
};

export default App;
