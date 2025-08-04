import IModule from "./iModule";

export default interface IGroupModule extends IModule {
    Modules: IModule[],

    flatten(): IModule[],
}