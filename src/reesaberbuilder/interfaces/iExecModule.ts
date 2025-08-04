import IGroupModule from "./iGroupModule";
import IModule from "./iModule";

export default interface IExecModule extends IGroupModule {

    exec(): IModule[],
}