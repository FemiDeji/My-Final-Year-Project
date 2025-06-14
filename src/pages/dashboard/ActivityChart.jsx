/* eslint-disable react/prop-types */
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

export default function ActivityChart({ data }) {
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	return (
		<div className="flex w-full justify-center items-center">
			<div className="w-full h-[290px] xs:h-[220px]">
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={data}
							dataKey="bookings"
							nameKey="month"
							cx="50%"
							cy="50%"
							outerRadius="60%"
							innerRadius="20%"
							fill="#82ca9d"
							label={({ name, percent }) =>
								`${name}: ${(percent * 100).toFixed(0)}%`
							}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
									fontSize={"70%"}
									style={{ outline: "none" }}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend wrapperStyle={{ fontSize: "12px", textAlign: "center" }} />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
