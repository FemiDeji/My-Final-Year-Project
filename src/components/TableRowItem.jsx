/* eslint-disable react/prop-types */

import { convertToDateTime } from "../helpers/dateAndTime";

import CustomStatusLabel from "./CustomStatusLabel";
import { BsArrowUpRight, BsDownload } from "react-icons/bs";

function TableRowItem({
	headers,
	dataList,
	onViewClick,
	viewTitle,
	isView,
	isDownload,
	navKey = "id",
}) {
	const getColumnData = (key) => {
		if (key === "checkbox") {
			return (
				<div>
					<input type="checkbox" className="translate-y-0.5" />
				</div>
			);
		} else if (key === "workItemNumber") {
			return dataList[key]; // Render Work Item No. if present
		} else if (key === "status") {
			return <CustomStatusLabel status={dataList[key]} />;
		} else if (key === "transactionType" || key === "status") {
			return <CustomStatusLabel type={dataList[key]} />;
		} else if (key === "start_date" || key === "end_date") {
			const d = convertToDateTime(dataList[key]);
			const date = d?.split(" ")[0];
			const time = d?.split(" ")[1];
			const meridian = d?.split(" ")[2];
			return (
				<div>
					<div className="xs:text-[10px]">{date}</div>
					<div className="-mt-2">
						<i className="text-[10px] xs:text-[8.5px]">
							{time} {meridian}
						</i>
					</div>
				</div>
			);
		} else {
			return dataList[key];
		}
	};

	return (
		<tr className="w-full hover:bg-gray-100 cursor-pointer text-[12px] xs:text-[10.5px] text-[#323c47] bg-white border border-y-2 text-left xs:table-row">
			{/* Render each data cell */}
			{headers.map(({ key }, index) => (
				<td
					key={index}
					scope="row"
					className="px-3 py-4 text-gray-500 whitespace-nowrap">
					{getColumnData(key)}
				</td>
			))}

			{/* Render actions column */}
			<td className={isView ? "w-full text-center px-5" : "w-0"}>
				{isView && (
					<div className="text-center flex gap-2 items-center justify-center relative text-[#2C4159] pl-1">
						<div className="flex justify-center items-center w-[2.5em] h-[2.5em] xs:w-[1.3rem] xs:h-[1.3rem] cursor-pointer rounded bg-general-light-grey">
							<BsArrowUpRight
								color="#000000"
								size={13}
								onClick={() => onViewClick(dataList[navKey])}
								title={viewTitle}
							/>
						</div>
					</div>
				)}
			</td>

			{isDownload && (
				<td className="text-center">
					<div className="text-center flex gap-2 items-center justify-center relative text-[#2C4159] pl-1">
						<div className="flex justify-center items-center w-[2.5em] h-[2.5em] cursor-pointer rounded bg-general-light-grey">
							<BsDownload color="#000000" size={13} />
						</div>
					</div>
				</td>
			)}
		</tr>
	);
}

export default TableRowItem;
