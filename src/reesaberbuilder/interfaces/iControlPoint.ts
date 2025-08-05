import IColor from "./base/iColor";

export default interface IControlPoint {
    time: number,
    value: number | IColor
}