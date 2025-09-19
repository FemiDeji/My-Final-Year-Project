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
import Unauthorized from "./pages/Unauthorized";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordExpired from "./pages/auth/ResetPasswordExpired";
import Pass from "./pages/pass/Pass";

function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route index element={<Navigate replace to="/dashboard" />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route
						path="/reset-password-expired"
						element={<ResetPasswordExpired />}
					/>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute
								authUser={["user", "admin", "security", "super-admin"]}>
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
						path="/passes"
						element={
							<ProtectedRoute
								authUser={["user", "super-admin", "admin", "security"]}>
								<Pass />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/history"
						element={
							<ProtectedRoute
								authUser={["user", "admin", "security", "super-admin"]}>
								<History />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute authUser={["user", "admin", "security"]}>
								<Settings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/bookings/new"
						element={
							<ProtectedRoute authUser={["user"]}>
								<CreateBookingForm />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/requests"
						element={
							<ProtectedRoute authUser={["admin", "security", "super-admin"]}>
								<Request />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/requests/new"
						element={
							<ProtectedRoute authUser={["super-admin"]}>
								<CreateBookingForm />
							</ProtectedRoute>
						}
					/>
					<Route path="/unauthorized" element={<Unauthorized />} />
					<Route path="*" element={<PageNotFound />} />
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
							"@media (maxWidth:426px)": {
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
