import ILocalTransform from "../../../interfaces/base/iLocalTransform";
import IModuleConfig from "../../../interfaces/iModuleConfig";
import Color from "../../base/Color";
import ControlPoint from "../../base/ControlPoint";
import LocalTransform from "../../base/LocalTransform";
import Vector3 from "../../base/Vector3";
import ModuleConfig from "./ModuleConfig";

export default class BlurSaberConfig extends ModuleConfig implements IModuleConfig {
    SaberSettings = {
            zOffsetFrom: -0.17,
            zOffsetTo: 1.0,
            thickness: 1.0,
            saberProfile: {
                interpolationType: 1,
                controlPoints: [
                    new ControlPoint(0.0, 0.458),
                    new ControlPoint(0.004, 0.722),
                    new ControlPoint(0.021, 0.861),
                    new ControlPoint(0.029, 0.694),
                    new ControlPoint(0.08, 0.917),
                    new ControlPoint(0.135, 1.0),
                    new ControlPoint(0.145, 0.847),
                    new ControlPoint(0.27, 0.722),
                    new ControlPoint(0.99, 0.361),
                    new ControlPoint(1.0, 0.069),
                ]
            },
            startCap: true,
            endCap: true,
            verticalResolution: 20,
            horizontalResolution: 10,
            renderQueue: 3002,
            cullMode: 0,
            depthWrite: true,
            blurFrames: 2.0,
            glowMultiplier: 1.0,
            handleRoughness: 2.0,
            handleColor: new Color(0.1, 0.1, 0.1, 0.0),
            maskSettings: {
            bladeMaskResolution: 256,
            driversMaskResolution: 32,
            handleMask: {
                interpolationType: 2,
                controlPoints: [
                    new ControlPoint(0.0, 0.0),
                    new ControlPoint(0.028, 1.0),
                    new ControlPoint(0.128, 0.0),
                    new ControlPoint(0.145, 1.0),
                    new ControlPoint(0.17, 0.0)
                ]
            },
            bladeMappings: {
                colorOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, new Color(1.0, 1.0, 1.0, 1.0))
                    ]
                },
                alphaOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, 1.0)
                    ]
                },
                scaleOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, 1.0)
                    ]
                },
              valueFrom: 0.0,
              valueTo: 1.0
            },
            driversSampleMode: 0,
            viewingAngleMappings: {
                colorOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, new Color(1.0, 1.0, 1.0, 1.0))
                    ]
                },
                alphaOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, 1.0)
                    ]
                },
                scaleOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, 1.0)
                    ]
                },
              valueFrom: 0.0,
              valueTo: 1.0
            },
            surfaceAngleMappings: {
                colorOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, new Color(1.0, 1.0, 1.0, 1.0))
                    ]
                },
                alphaOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, 1.0)
                    ]
                },
                scaleOverValue: {
                    interpolationType: 0,
                    controlPoints: [
                        new ControlPoint(0.0, 1.0)
                    ]
                },
              valueFrom: 0.0,
              valueTo: 1.0
            },
            drivers: []
            }
    }
    Enabled: boolean;
    Name: string;
    LocalTransform: ILocalTransform;
    
    constructor(name: string) {
        super(name)
        this.Enabled = true;
        this.Name = name;
        this.LocalTransform = new LocalTransform(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(1, 1, 1)
        )
    }
}