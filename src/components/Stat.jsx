/* eslint-disable react/prop-types */
export default function Stat({ icon, title, value }) {
	return (
		<div className="bg-general-grey border rounded-md p-4 flex flex-row justify-center items-center gap-3">
			<div
				className={`row-span-full aspect-square rounded-full flex justify-center items-center `}>
				<svg className="w-7 h-7 text-general-blue">{icon}</svg>
			</div>
			<div className="self-end text-[1rem] uppercase tracking-[0.4px] font-semibold text-general-yellow">
				{title}
			</div>
			<div className="text-[1.4rem] leading-none font-medium">{value}</div>
		</div>
	);
}
