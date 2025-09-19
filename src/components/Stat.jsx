/* eslint-disable react/prop-types */
export default function Stat({ icon, title, value, onclick = () => {} }) {
	return (
		<div
			className="bg-white shadow-sm rounded-lg p-2 py-3 flex flex-row justify-center items-center w-full"
			onClick={onclick}>
			<div className="flex flex-row justify-start items-center gap-3 w-full">
				<div
					className={`flex justify-center items-center p-1 xs:p-0.5 w-9 h-10 xs:w-8 xs:h-8`}>
					<div className="w-10 h-7 xs:w-[1.3rem] xs:h-5 text-[#002855] ">
						{icon}
					</div>
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
