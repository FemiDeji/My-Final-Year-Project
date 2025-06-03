/* eslint-disable react/prop-types */
export const ImageViewer = ({ title, src, alt }) => {
	return (
		<div className="mt-4">
			<p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
			<img src={src} alt={alt} className="w-full max-w-sm rounded-md border" />
		</div>
	);
};
