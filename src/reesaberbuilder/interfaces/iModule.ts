import IModuleConfig from "./iModuleConfig";

export default interface IModule {
    ModuleId: string,
    Version: number,
    Config: IModuleConfig
}