import IModule from "../../interfaces/iModule";
import BlurSaberConfig from "./configs/BlurSaberConfig";

export default class BlurSaberModule implements IModule {
    ModuleId = "reezonate.blur-saber";
    Version = 1;
    Config = new BlurSaberConfig("Blur Saber"); 

}