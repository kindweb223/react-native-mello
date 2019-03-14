import Task from "data.task";

export const resolveData = (item) => {
	return new Task((reject, resolve) => resolve({
		...item,
		dimensions: {
			width: item.width,
			height: item.height
		}
	// eslint-disable-next-line
	}), (err) => reject(err));
};
