/* eslint-disable react/prop-types */
import classnames from "classnames";
import "./css/pagination.scss";
import { usePagination } from "../hooks/usePagination";
import { DOTS } from "../constants/texts";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import DoubleLeftArrowIcon from "./DoubleLeftArrowIcon";
import DoubleRightArrowIcon from "./DoubleRightArrowIcon";

const Pagination = ({
	onPageChange,
	totalCount,
	siblingCount = 1,
	currentPage,
	pageSize,
	className,
}) => {
	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	// If there are less than 2 times in pagination range we shall not render the component
	if (currentPage === 0 || paginationRange?.length < 2) {
		return null;
	}

	let lastPage = paginationRange[paginationRange?.length - 1];

	const onFirst = () => {
		onPageChange(1);
	};
	const onLast = () => {
		onPageChange(lastPage);
	};
	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	return (
		<ul
			className={classnames(
				"pagination-container text-sm xs:text-xs flex justify-center w-full items-center gap-2 xs:flex-col",
				{ [className]: className }
			)}>
			{/* Renders only for small screens */}
			<div className="flex gap-2 lg:hidden ">
				{paginationRange.map((pageNumber, index) => {
					// If the pageItem is a DOT, render the DOTS unicode character
					if (pageNumber === DOTS) {
						return (
							<li className="pagination-item dots" key={index}>
								&#8230;
							</li>
						);
					}

					// Render our Page Pills
					return (
						<div
							key={index}
							className={`${
								pageNumber === currentPage
									? "bg-[#f2c008] text-white"
									: "bg-white"
							} border shadow-sm py-[4px] px-[10px] rounded-md hover:bg-[#f2c008] hover:text-white cursor-pointer flex items-center justify-center`}
							onClick={() => onPageChange(pageNumber)}>
							<li
								className={classnames("pagination-ite ", {
									selected: pageNumber === currentPage,
								})}>
								{pageNumber}
							</li>
						</div>
					);
				})}
			</div>
			{/* First navigation arrow */}
			<div className="flex justify-center w-full items-center gap-2">
				<div
					onClick={onFirst}
					className={`${
						currentPage === 1 ? "disabled" : "cursor-pointer"
					} border py-[4px] px-[10px] hover:bg-[#f2c008] hover:text-white bg-white rounded-md`}>
					<li
						className={classnames("pagination-", {
							disabled: currentPage === 1,
						})}>
						<div className="flex gap-2 items-center">
							<div>
								<DoubleLeftArrowIcon className="text-lg font-bold" />
							</div>
							<div className="">First</div>
						</div>
					</li>
				</div>

				{/* Back navigation arrow */}
				<div
					onClick={onPrevious}
					className={`${
						currentPage === 1 ? "disabled" : "cursor-pointer"
					} border py-[4px] px-[10px] hover:bg-[#f2c008] hover:text-white bg-white rounded-md`}>
					<li
						className={classnames("pagination-", {
							disabled: currentPage === 1,
						})}>
						<div className="flex gap-2 items-center">
							<div>
								<PiCaretLeftBold className="text-lg font-bold" />
							</div>
							<div className="">Back</div>
						</div>
					</li>
				</div>

				<div className="flex gap-2 xs:hidden">
					{paginationRange.map((pageNumber, index) => {
						// If the pageItem is a DOT, render the DOTS unicode character
						if (pageNumber === DOTS) {
							return (
								<li className="pagination-item dots" key={index}>
									&#8230;
								</li>
							);
						}

						// Render our Page Pills
						return (
							<div
								key={index}
								className={`${
									pageNumber === currentPage
										? "bg-[#f2c008] text-white"
										: "bg-white"
								} border shadow-sm py-[4px] px-[10px] rounded-md hover:bg-[#f2c008] hover:text-white cursor-pointer flex items-center justify-center`}
								onClick={() => onPageChange(pageNumber)}>
								<li
									className={classnames("pagination-ite ", {
										selected: pageNumber === currentPage,
									})}>
									{pageNumber}
								</li>
							</div>
						);
					})}
				</div>

				{/*  Next Navigation arrow */}
				<div
					onClick={onNext}
					className={`${
						currentPage === lastPage ? "disabled" : "cursor-pointer"
					} border py-[4px] px-[10px] bg-white hover:bg-[#f2c008] hover:text-white rounded-md`}>
					<li
						className={classnames("pagination-ite", {
							disabled: currentPage === lastPage,
						})}>
						<div className="flex gap-2 items-center">
							<div className="">Next</div>
							<div>
								<PiCaretRightBold className="text-lg font-bold" />
							</div>
						</div>
					</li>
				</div>

				{/*  Last Navigation arrow */}
				<div
					onClick={onLast}
					className={`${
						currentPage === lastPage ? "disabled" : "cursor-pointer"
					} border py-[4px] px-[10px] bg-white hover:bg-[#f2c008] hover:text-white rounded-md`}>
					<li
						className={classnames("pagination-ite", {
							disabled: currentPage === lastPage,
						})}>
						<div className="flex gap-2 items-center">
							<div className="">Last</div>
							<div>
								<DoubleRightArrowIcon className="text-lg font-bold" />
							</div>
						</div>
					</li>
				</div>
			</div>
		</ul>
	);
};

export default Pagination;
