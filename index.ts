import styleinject from "./src/styleinject";

export default class Index {
	styleinject: typeof styleinject;
	constructor() {
		this.styleinject = styleinject;
	};
};
