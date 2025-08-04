import { ReeSaber } from "../../reesaberbuilder";
import IUI from "./iUI";

export default interface IElement {
    dom: HTMLElement,
    drag?: HTMLElement,
    onTop: boolean,
    subElements: IElement[],
    classes: string[],
    file?: ReeSaber,

    parent: IElement | IUI,
    

    addClasses(): void;
    appendElements(): void;
    close(): void;
    createDragListener(): void;
    init(): void;
}