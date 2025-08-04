import IColor from "./iColor";

export default interface IControlPoint {
    time: number,
    value: number | IColor
}