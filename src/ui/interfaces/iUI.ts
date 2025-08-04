import { ReeSaber } from "../../reesaberbuilder";
import IElement from "./iElement";

export default interface IUI {
    dom: HTMLElement;
    subElements: IElement[];
    file: ReeSaber

    appendElements(): void;
}