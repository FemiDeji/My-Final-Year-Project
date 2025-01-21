/* eslint-disable react/prop-types */

import TableHeader from "./TableHeader";
import TableRowItem from "./TableRowItem";
import CustomNoRecordFound from "./CustomNoRecordFound";
import { PAGE_SIZE } from "../constants/texts";
import Pagination from "./Pagination";

function Table({
	headers,
	data,
	onViewClick,
	viewTitle,
	isView,
	isDownolad,
	hasActions = true,
	navKey = "id",
	showCheckbox = false,
	showWorkItemNumber = false,
	onDownload = () => {},
	showSerialNumber = true,
	totalCount = 0,
	currentPage = 1,
	pageSize = PAGE_SIZE,
	onPageChange = () => {},
	// Add new prop to determine if Serial Number should be shown})
}) {
	const addOptionalColumnsToHeaders = (headers) => {
		const updatedHeaders = [...headers];

		// Add checkbox column if enabled, otherwise add SN column first
		if (showCheckbox) {
			updatedHeaders.unshift({ value: "", key: "checkbox" });
		}

		// Add SN column if enabled
		if (showSerialNumber) {
			if (showCheckbox) {
				// If checkbox is present, add SN after it
				updatedHeaders.splice(1, 0, { value: "SN", key: "serialNumber" });
			} else {
				// If no checkbox, SN should be the first column
				updatedHeaders.unshift({ value: "SN", key: "serialNumber" });
			}
		}

		// Add Work Item No column if enabled
		if (showWorkItemNumber) {
			updatedHeaders.splice(showCheckbox ? 2 : 1, 0, {
				value: "Work Item No",
				key: "workItemNumber",
			});
		}

		if (isDownolad) {
			updatedHeaders.push({ value: "", key: "download" }); // Blank title for download column
		}

		return updatedHeaders;
	};

	const formatWorkItemNumber = (index) => String(index + 1).padStart(5, "0");

	return (
		<div className="overflow-x-auto mb-8 mt-2 w-full">
			<table className="w-full text-sm text-left rtl:text-right bg-gray-50 dark:text-gray-300 text-general-blue">
				<TableHeader
					headers={addOptionalColumnsToHeaders(headers)}
					hasActions={hasActions}
					showCheckbox={showCheckbox}
				/>
				<tbody>
					{data?.map((dataItem, index) => (
						<TableRowItem
							key={index}
							headers={addOptionalColumnsToHeaders(headers)}
							dataList={{
								checkbox: showCheckbox ? <input type="checkbox" /> : null,
								serialNumber: showSerialNumber ? index + 1 : null, // Simple incrementing SN
								workItemNumber: showWorkItemNumber
									? formatWorkItemNumber(index)
									: null,
								...dataItem,
								sn: index + 1,
							}}
							onViewClick={onViewClick}
							viewTitle={viewTitle}
							isView={isView}
							navKey={navKey}
							onDownload={onDownload}
							isDownload={isDownolad}
						/>
					))}
				</tbody>
			</table>
			{data && data.length < 1 && <CustomNoRecordFound />}

			<div className="w-full mt-5">
				<Pagination
					totalCount={totalCount}
					currentPage={currentPage}
					onPageChange={onPageChange}
					pageSize={pageSize}
				/>
			</div>
		</div>
	);
}

export default Table;
