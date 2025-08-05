import ILocalTransform from "./iLocalTransform";
import IModule from "./iModule";

export default interface IReeSaber {
    // Required Values
    ModVersion: string,
    Version: number,
    LocalTransform: ILocalTransform,
    Modules: IModule[]

    // Functions
    export(name: string): void;
    flatten(): void;
    softflatten(): IModule[];
    import(file: any, overwrite: boolean): void;
    save(name: string): void;
}