import IModuleConfig from "./iModuleConfig";

export default interface IModule {
    // Required Values
    ModuleId: string,
    Version: number,
    Config: IModuleConfig,
    Children: IModule[],

    // Functions
    flatten(): void
}