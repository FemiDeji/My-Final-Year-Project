/* eslint-disable react/prop-types */

function TableHeader({ headers = [], hasActions }) {
	return (
		<thead className="font-[400] text-[11.5px] w-full text-nowrap">
			<tr className="border-b border-gray-300 bg-gray-200 w-full text-gray-800">
				{/* Render all headers */}
				{headers.map((header, index) =>
					header.value || header.key !== "actions" ? (
						<th
							key={index}
							scope="col"
							className="px-3 py-3 font-[600] xs:text-[10.5px] text-[11.5px] text-left">
							{/* Render a checkbox for the "checkbox" column */}
							{header.key === "checkbox" ? (
								<div className="translate-y-0.5">
									<input type="checkbox" />
								</div>
							) : (
								header.value
							)}
						</th>
					) : null
				)}

				{/* Render actions column */}
				{hasActions && (
					<th
						scope="col"
						className="px-6 py-3 font-[500] xs:text-[10.5px] text-[11px]"></th>
				)}
			</tr>
		</thead>
	);
}

export default TableHeader;
