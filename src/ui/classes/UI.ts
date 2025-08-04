import { ReeSaber } from "../../reesaberbuilder";
import IElement from "../interfaces/iElement";
import IUI from "../interfaces/iUI";
import ExportMenu from "./ExportMenu";
import ImportMenu from "./ImportMenu";
import TopBar from "./topbar/TopBar";

export default class UI implements IUI {
    dom = document.createElement("div");
    file: ReeSaber;
    subElements: IElement[] = [
        
    ];

    constructor(file: ReeSaber) {
        this.file = file;
        this.subElements.push(new TopBar(this, this.file));
        document.body.appendChild(this.dom);
        this.appendElements();
    }

    appendElements(): void {
        for (let element in this.subElements) {
            this.dom.appendChild(this.subElements[element].dom)
        }
    }
}