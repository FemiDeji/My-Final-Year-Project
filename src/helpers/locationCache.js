export const getCachedCoords = () => {
	const coords = localStorage.getItem("lastCoords");
	if (!coords) return null;
	try {
		return JSON.parse(coords);
	} catch {
		return null;
	}
};

export const saveCoordsToCache = (coords) => {
	localStorage.setItem("lastCoords", JSON.stringify(coords));
};
