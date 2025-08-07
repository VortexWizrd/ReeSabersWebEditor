import IModule from "../interfaces/iModule";
import IReeSaber from "../interfaces/iReeSaber";
import LocalTransform from "./base/LocalTransform";
import BlurSaberModule from "./modules/BlurSaberModule";
import EmptyModule from "./modules/EmptyModule";
import SimpleTrailModule from "./modules/SimpleTrailModule";
import Vector3 from "./base/Vector3";

export default class ReeSaber implements IReeSaber {
    ModVersion = "0.3.14";
    Version = 1;
    LocalTransform = new LocalTransform(
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0)
    );
    Modules: IModule[] = [];

    constructor() {

    }

    dataToModule(data: IModule): IModule {
        let newModule: IModule;
        let oldModuleChildren = data.Children || [];
        let newModuleChildren: IModule[] = [];

        for (let module of oldModuleChildren) {
            newModuleChildren = newModuleChildren.concat(this.dataToModule(module));
        }

        switch (data.ModuleId) {

            case "reezonate.empty":
                newModule = Object.assign(new EmptyModule(), data)
                break;

            case "reezonate.blur-saber":
                newModule = Object.assign(new BlurSaberModule(), data)
                break;

            case "reezonate.simple-trail":
                newModule = Object.assign(new SimpleTrailModule(), data)
                break;

            default: 
                newModule = Object.assign(new EmptyModule(), data)
                break;
        }

        newModule.Children = newModuleChildren;

        return newModule;
    }

    export(name: string): void {
        let oldModules = this.Modules;

        this.save(name);

        this.Modules = oldModules;
    }

    flatten(): void {
        let newModules: IModule[] = [];

        for (let module of this.Modules) {
            module.flatten();
            newModules = newModules.concat(module.Children);
            module.Children = [];
            newModules = newModules.concat(module);
        }

        this.Modules = newModules;
    }

    softflatten(): IModule[] {
        let newModules: IModule[] = [];

        for (let module of this.Modules) {
            module.flatten();
            newModules = newModules.concat(module.Children);
            let clearedModule = structuredClone(module);
            newModules = newModules.concat(clearedModule);
        }

        return newModules
    }

    import(file: any, overwrite: boolean): void {
        let newModules: IModule[] = [];

        for (let module of file.Modules) {
            let convertedModule = this.dataToModule(module)
            newModules = newModules.concat(convertedModule);
        }

        if (overwrite) {
            this.Modules = newModules
        } else {
            this.Modules = this.Modules.concat(newModules);
        }
    }

    save(name: string): void {
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this, null, 2));
        let anchor = document.createElement('a');
        anchor.setAttribute("href", data);
        anchor.setAttribute("download", name + ".json");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    
    
}