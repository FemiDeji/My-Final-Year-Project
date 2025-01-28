import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

/* eslint-disable react/prop-types */
export default function BookingSummary({ data }) {
	const COLORS = ["#4CAF50", "#2196F3", "#FF5722"];

	return (
		<div className="w-full items-center justify-center flex">
			<div className="w-full xs:h-[200px] h-[300px]">
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={data}
							dataKey={"value"}
							nameKey={"name"}
							cy={"50%"}
							cx={"50%"}
							outerRadius="65%"
							innerRadius="24%"
							fill="#8884d8"
							label={({ name, percent }) =>
								`${name}: ${(percent * 100).toFixed(0)}%`
							}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
									fontSize={"85%"}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend wrapperStyle={{ fontSize: "14px", textAlign: "center" }} />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
