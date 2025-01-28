/* eslint-disable react/prop-types */
export default function Stat({ icon, title, value }) {
	return (
		<div className="bg-white shadow-sm rounded-lg p-2 flex flex-row justify-center items-center w-full">
			<div className="flex flex-row justify-start items-center w-full gap-3">
				<div
					className={`flex justify-center items-center rounded-lg p-1 border`}>
					<svg className="w-7 h-7 xs:w-5 xs:h-5 text-[#002855]">{icon}</svg>
				</div>
				<div className="text-[1rem] xs:text-[14px] capitalize tracking-[0.4px] font-semibold text-general-blue">
					{title}
				</div>
			</div>
			<div className="ml-auto text-[1.1rem] xs:text-[14px] leading-none font-semibold text-[#f2c008]">
				{value}
			</div>
		</div>
	);
}
