import ILocalTransform from "./iLocalTransform";
import IModule from "./iModule";

export default interface IReeSaber {
    ModVersion: string,
    Version: number,
    LocalTransform: ILocalTransform,
    Modules: IModule[]

    export(name: string): void;

    flatten(): IModule[];

    import(file: any): void;

    importModules(file: any): void;

    save(name: string): void;
}