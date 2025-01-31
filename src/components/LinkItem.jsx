/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from "react-router-dom";

const LinkItem = ({
	text,
	url,
	children,
	showIconOnly = false,
	setIsSidebarOpen,
}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const handleRedirect = () => {
		if (setIsSidebarOpen) {
			setIsSidebarOpen(false);
		}
		navigate(url);
	};

	const isActive = location.pathname.startsWith(url);

	return (
		<div
			onClick={(e) => {
				e.preventDefault();
				handleRedirect();
			}}
			className={`flex gap-3 items-center p-3 cursor-pointer rounded-lg font-semibold text-sm hover:bg[#FFFFFF33] 
        ${
					isActive
						? "bg-[#f5f5f5] text-general-blue border justify-start "
						: "text-general-blue justify-start"
				} 
        ${isActive ? "h-11 " : ""} 
      `}>
			<div className="text-[1.5em] xs:text-[1.3em]">{children}</div>
			{!showIconOnly && <div className="xs:text-[0.9em]">{text}</div>}
		</div>
	);
};

export default LinkItem;
