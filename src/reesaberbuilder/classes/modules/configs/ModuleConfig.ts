import ILocalTransform from "../../../interfaces/iLocalTransform";
import IModuleConfig from "../../../interfaces/iModuleConfig";
import LocalTransform from "../../LocalTransform";
import Vector3 from "../../Vector3";

export default class ModuleConfig implements IModuleConfig {
    SaberSettings?: object | undefined;
    MeshSettings?: object | undefined;
    MaterialSettings?: object | undefined;
    Enabled: boolean;
    Name: string;
    LocalTransform: ILocalTransform;

    constructor(name: string) {
        this.Enabled = true;
        this.Name = name;
        this.LocalTransform = new LocalTransform(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0)
        )
    }
    
}