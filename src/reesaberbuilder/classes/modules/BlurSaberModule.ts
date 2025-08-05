import IModule from "../../interfaces/iModule";
import BlurSaberConfig from "./configs/BlurSaberConfig";
import EmptyModule from "./EmptyModule";

export default class BlurSaberModule extends EmptyModule {
    ModuleId = "reezonate.blur-saber";
    Version = 1;
    Config = new BlurSaberConfig("Blur Saber"); 
    Children: IModule[] = [];
}