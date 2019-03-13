export function insertIntoColumn (resolvedImage, dataSet, sorted) {
	let dataCopy = dataSet.slice();
	const columnIndex = resolvedImage.column;
	const column = dataSet[columnIndex];

	if (column) {
		let images = [...column, resolvedImage];
		if (sorted) {
			images = images.sort((a, b) => (a.index < b.index) ? -1 : 1);
		}
		dataCopy[columnIndex] = images;
	} else {
		dataCopy = [...dataCopy, [resolvedImage]];
	}

	return dataCopy;
}
