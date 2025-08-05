import IModule from "../../interfaces/iModule";
import ModuleConfig from "./configs/ModuleConfig";

export default class EmptyModule implements IModule {
    
    ModuleId = "reezonate.empty";
    Version = 1;
    Config = new ModuleConfig("Empty");
    Children: IModule[] = [];

    flatten(): void {
        
        let newModules: IModule[] = [];

        for (let module of this.Children) {
            console.log("flatten: " + module.Config.Name);
            module.flatten();
            newModules = newModules.concat(module);
        }

        this.Children = newModules;
    }
}