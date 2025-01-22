import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Bookings from "./pages/booking/Bookings";
import History from "./pages/history/History";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/bookings" element={<Bookings />} />
					<Route path="/history" element={<History />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
