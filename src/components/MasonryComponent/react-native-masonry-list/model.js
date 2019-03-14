import Task from "data.task";

export const resolveImage = (image) => {
	return new Task((reject, resolve) => resolve({
		...image,
		dimensions: {
			width: image.width,
			height: image.height + 100
		}
	// eslint-disable-next-line
	}), (err) => reject(err));
};
