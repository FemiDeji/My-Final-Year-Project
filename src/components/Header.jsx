import { HiMiniArrowRightOnRectangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

export default function Header() {
	const navigate = useNavigate();

	return (
		<div className="flex justify-between py-2 px-10 shadow-sm bg-white fixed w-full z-50 ">
			<img src="hello" alt="AU logo" />
			<div className="flex items-center gap-6 cursor-pointer">
				<div className="rounded-full w-10 h-10 border-white border-2 bg-general-yellow"></div>
				<div className="text-general-blue flex flex-row gap-5 justify-center items-center">
					<div className="flex justify-start items-start flex-col">
						<div className="font-medium text-base">Oluwafemi Adeniyi</div>
						<div className="text-xs font-normal mb-1">02/1023</div>
					</div>
				</div>
				<div className="bg-general-blue h-[2.5rem] w-[0.1rem]"></div>

				<div
					className="flex gap-2 items-center text-general-light-red"
					onClick={() => navigate("/login")}>
					<span>
						<HiMiniArrowRightOnRectangle size={20} />
					</span>
					<span>Log Out</span>
				</div>
			</div>
		</div>
	);
}
