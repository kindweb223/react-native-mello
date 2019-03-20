export function insertIntoColumn (resolvedImage, dataSet) {
	let dataCopy = dataSet.slice();
	const columnIndex = resolvedImage.column;
	const column = dataSet[columnIndex];

	if (column) {
		let images = [...column, resolvedImage];
		dataCopy[columnIndex] = images;
	} else {
		dataCopy = [...dataCopy, [resolvedImage]];
	}

	return dataCopy;
}
