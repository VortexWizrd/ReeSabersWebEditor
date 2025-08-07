import IVector3 from "./iVector3";

export default interface ILocalTransform {
    Position: IVector3,
    Rotation: IVector3,
    Scale: IVector3
}