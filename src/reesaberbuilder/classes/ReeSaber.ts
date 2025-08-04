import IModule from "../interfaces/iModule";
import IReeSaber from "../interfaces/iReeSaber";
import IGroupModule from "../interfaces/iGroupModule";
import LocalTransform from "./LocalTransform";
import Vector3 from "./Vector3";

export default class ReeSaber implements IReeSaber {
    ModVersion = "0.3.13";
    Version = 1;
    LocalTransform = new LocalTransform(
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0)
    );
    Modules: IModule[] = [];

    constructor() {

    }

    export(name: string): void {
        let oldModules = this.Modules;

        /* Convert group modules to individual modules */

        this.Modules = this.flatten();

        this.save(name);

        this.Modules = oldModules;
    }

    flatten(): IModule[] {
        function isGroup(module: IModule): module is IGroupModule {
            return (module as IGroupModule).flatten !== undefined;
        }
        
        let newModules: IModule[] = [];

        for (let module in this.Modules) {
            if (isGroup(this.Modules[module])) {
                newModules = newModules.concat(this.Modules[module].flatten());
            } else {
                newModules = newModules.concat([this.Modules[module]]);
            }
        }

        return newModules;
    }

    import(file: any): void {
        this.Modules = file.Modules;
        console.log(this);
    }

    importModules(file: any): void {
        this.Modules = this.Modules.concat(file.Modules);
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