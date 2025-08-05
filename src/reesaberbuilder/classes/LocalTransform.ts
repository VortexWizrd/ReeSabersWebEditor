import ILocalTransform from "../interfaces/iLocalTransform";
import IVector3 from "../interfaces/base/iVector3";

export default class LocalTransform implements ILocalTransform {
    Position: IVector3;
    Rotation: IVector3;
    Scale: IVector3;

    constructor(position: IVector3, rotation: IVector3, scale: IVector3) {
        this.Position = position;
        this.Rotation = rotation;
        this.Scale = scale;
    }
    
}