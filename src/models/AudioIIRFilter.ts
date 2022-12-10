import {Helper} from "../gameApp/helpers/Helper";

export default class AudioIIRFilter{
	id: string;
	feedforward: number[]; //массив до 20 элементов, Хотя бы 1 не должны быть нулём
	feedback: number[]; //массив до 20 элементов, первый не должен быть нулём

	constructor(feedforward: number[], feedback: number[])
	{
		this.id = Helper.generateUid();
		this.feedforward = feedforward;
		this.feedback = feedback;
	}
}