import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Bookings from "./pages/booking/Bookings";
import History from "./pages/history/History";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound";
import Settings from "./pages/settings/Settings";
import CreateBookingForm from "./pages/booking/CreateBookingForm";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Request from "./pages/request/Request";

function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route index element={<Navigate replace to="/dashboard" />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/signup"
						element={
							<ProtectedRoute authUser={["user", "admin"]}>
								<SignUp />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute authUser={["user", "admin"]}>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/bookings"
						element={
							<ProtectedRoute authUser={["user"]}>
								<Bookings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/history"
						element={
							<ProtectedRoute authUser={["user", "admin"]}>
								<History />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute authUser={["user", "admin"]}>
								<Settings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/new-booking"
						element={
							<ProtectedRoute authUser={["user"]}>
								<CreateBookingForm />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/requests"
						element={
							<ProtectedRoute authUser={["admin"]}>
								<Request />
							</ProtectedRoute>
						}
					/>
					<Route path="/unauthorized" element={<PageNotFound />} />
				</Routes>

				<Toaster
					position="top-center"
					gutter={12}
					containerStyle={{ margin: "8px" }}
					toastOptions={{
						success: { duration: 3000 },
						error: { duration: 5000 },
						style: {
							fontSize: "13px",
							maxWidth: "500px",
							padding: "16px 24px",
							backgroundColor: "white",
							color: "#002855",
							textAlign: "center",
							// Responsive font size
							"@media (max-width:426px)": {
								fontSize: "8px",
								maxWidth: "300px",
								padding: "4px 8px",
							},
						},
					}}
				/>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
