import ILocalTransform from "./base/iLocalTransform";
import IModule from "./iModule";

export default interface IReeSaber {
    // Required Values
    ModVersion: string,
    Version: number,
    LocalTransform: ILocalTransform,
    Modules: IModule[]

    // Functions
    
    /**
     * Export ReeSaber as a .json file
     * @param name The name to set the file
     */
    export(name: string): void;

    /**
     * Flatten the module tree
     */
    flatten(): void;

    /**
     * Return a flattened version of the module tree
     */
    softflatten(): IModule[];

    /**
     * Add modules from an existing ReeSaber
     * @param file The file to read
     * @param overwrite Overwrite existing modules
     */
    import(file: any, overwrite: boolean): void;

    /**
     * Save the object as-is with no modifications to a .json
     * @param name The name to set the file
     */
    save(name: string): void;
}