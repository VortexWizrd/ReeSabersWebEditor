import IModule from "../../interfaces/iModule";
import LocalTransform from "../LocalTransform";
import Vector3 from "../Vector3";

export default class SimpleTrailModule implements IModule {
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
    
}