import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Bookings from "./pages/booking/Bookings";

function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/bookings" element={<Bookings />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
