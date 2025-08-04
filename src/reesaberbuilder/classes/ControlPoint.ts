import IColor from "../interfaces/iColor";
import IControlPoint from "../interfaces/iControlPoint";

export default class ControlPoint implements IControlPoint {
    time: number;
    value: number | IColor;

    constructor(time: number, value: number | IColor) {
        this.time = time,
        this.value = value
    }
}