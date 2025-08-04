import ILocalTransform from "./iLocalTransform";

export default interface IModuleConfig {
    SaberSettings?: object,
    MeshSettings?: object,
    MaterialSettings?: object

    Enabled: boolean,
    Name: string,
    LocalTransform: ILocalTransform
}