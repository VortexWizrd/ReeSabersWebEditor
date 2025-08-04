import IGroupModule from "../../interfaces/iGroupModule";
import IModule from "../../interfaces/iModule";
import ModuleConfig from "./configs/ModuleConfig";

export default class GroupModule implements IGroupModule {
    ModuleId = "vortexwizrd.group";
    Version = 1;
    Config = new ModuleConfig("Group");

    Modules: IModule[] = [];


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

        if ("LocalTransform" in this.Config) {
            for (let module in newModules) {
                if ("LocalTransform" in newModules[module].Config) {
                    //@ts-ignore
                    newModules[module].Config.LocalTransform.Position = newModules[module].Config.LocalTransform.Position.sum(this.Config.LocalTransform.Position);

                    //@ts-ignore
                    newModules[module].Config.LocalTransform.Rotation = newModules[module].Config.LocalTransform.Rotation.sum(this.Config.LocalTransform.Rotation);

                    //@ts-ignore
                    newModules[module].Config.LocalTransform.Scale = newModules[module].Config.LocalTransform.Scale.sum(this.Config.LocalTransform.Scale);
                }
            }
        }

        return newModules;
    }
}