import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import AUImage from "/AU_logo.jpg";

export const delayAction = (callback, delay = 2000) => {
	setTimeout(() => {
		callback();
	}, delay);
};

export const exportPDF = (
	title,
	headers,
	dataKeys,
	data,
	filename,
	unit = "pt",
	size = "A2",
	orientation = "landscape",
	marginLeft = 40,
	fontSize = 18
) => {
	const doc = new jsPDF(orientation, unit, size);

	doc.setFontSize(fontSize);

	const transformedData = data?.map((elt) => {
		return [...dataKeys.map((key) => elt[key])];
	});

	if (transformedData) {
		let content = {
			startY: 50,
			head: headers,
			body: transformedData,
		};

		doc.text(title, marginLeft, 40);
		doc.autoTable(content);
		doc.save(filename);
	}
};

export const transformData = (data) => {
	if (!data) {
		console.error("Data is undefined.");
		return [];
	}

	const dataWithSerialNumber = data.map((d, index) => {
		return { sn: index + 1, ...d };
	});

	const newData = dataWithSerialNumber.map((d) => {
		const newObj = {};
		for (const el in d) {
			const key = el;
			if (
				el.toLowerCase().includes("date") ||
				el.toLowerCase().includes("created_on")
			) {
				if (d[el]) {
					newObj[key] = moment(d[el]).format("DD-MM-YYYY hh:mm A");
				}
			} else {
				newObj[key] = d[el];
			}
		}
		return newObj;
	});

	return newData;
};

const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

export const downloadExcel = async (
	rawData,
	filename,
	heading = [[]],
	headerKeys
) => {
	let data = transformData(rawData);
	heading = heading.map((hd) => {
		return ["S/N", ...hd];
	});

	const transformedData = data?.map((elt) => {
		return [elt["sn"], ...headerKeys.map((key) => elt[key]?.toString())];
	});

	data = transformedData;

	const workbook = XLSX.utils.book_new();

	// Convert the image to Blob
	const imageBlob = new Blob([AUImage], {
		type: "image/png",
	});

	// Convert the logo to base64
	const base64Logo = await getBase64(imageBlob);

	const worksheet = XLSX.utils.json_to_sheet([]);

	// Add headers to the first row
	XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: "A1" });

	// Add image (if required)
	const imageId = workbook.Workbook ? workbook.Workbook.length : 0;
	worksheet["!images"] = [
		{
			name: `image${imageId}`,
			data: base64Logo,
			opts: {
				t1: { col: 0, row: 0 }, // You can adjust this to place the image where needed
				ext: { width: 100, height: 50 },
			},
		},
	];

	// Add transformed data starting from row 2
	XLSX.utils.sheet_add_json(worksheet, data, {
		origin: "A2",
		skipHeader: true,
	});

	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	XLSX.writeFile(workbook, filename);
};

/**
 * @desc get table data as json
 * @param data
 * @param columns
 */
export const getTableDataForExport = (data, columns) => {
	return data?.map((record) =>
		columns.reduce(
			(recordToDownload, column) => ({
				...recordToDownload,
				[column.value]: record[column.key],
			}),
			{}
		)
	);
};

export const makeCsv = async (rows, filename) => {
	const separator = ";";
	if (rows?.length < 1) {
		return;
	}
	const keys = Object.keys(rows[0]);

	const csvContent = `${keys.join(separator)}\n${rows
		.map((row) =>
			keys
				.map((k) => {
					let cell = row[k] === null || row[k] === undefined ? "" : row[k];

					cell =
						cell instanceof Date
							? cell.toLocaleString()
							: cell.toString().replace(/"/g, '""');

					if (cell.search(/("|,|\n)/g) >= 0) {
						cell = `"${cell}"`;
					}
					return cell;
				})
				.join(separator)
		)
		.join("\n")}`;

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	if (navigator.msSaveBlob) {
		// In case of IE 10+
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement("a");
		if (link.download !== undefined) {
			// Browsers that support HTML5 download attribute
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
};
