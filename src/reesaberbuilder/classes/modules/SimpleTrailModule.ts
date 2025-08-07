import IModule from "../../interfaces/iModule";
import LocalTransform from "../base/LocalTransform";
import Vector3 from "../base/Vector3";
import EmptyModule from "./EmptyModule";

export default class SimpleTrailModule extends EmptyModule {
    ModuleId = "reezonate.simple-trail";
    Version = 1;
    Config = {
        MeshSettings: {

        },
        MaterialSettings: {

        },
        Enabled: true,
        Name: "Blur Saber",
        LocalTransform: new LocalTransform(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0)
        )
    };
    Children: IModule[] = [];
    
}