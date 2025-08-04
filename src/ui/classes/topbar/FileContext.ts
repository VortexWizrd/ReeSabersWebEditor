import { ReeSaber } from "../../../reesaberbuilder";
import IElement from "../../interfaces/iElement";
import Button from "../Core/Button";
import ContextMenu from "../Core/ContextMenu";
import ExportMenu from "../ExportMenu";
import ImportMenu from "../ImportMenu";
import UI from "../UI";
import Element from "../Core/Element";

export default class FileContext extends ContextMenu implements IElement {
    dom = document.createElement("div");
    onTop = true;
    subElements: IElement[] = [
        new Button(this, "Import"),
        new Button(this, "Export"),
    ];
    file: ReeSaber
    
    constructor(parent: Element | UI, file: ReeSaber) {
        super(parent);
        this.file = file
        this.init();

        this.dom.addEventListener("mouseleave", (e) => {
            this.close();
        })

        this.subElements[0].dom.addEventListener("click", (e) => {
            //@ts-ignore
            let menu = new ImportMenu(this.parent.parent, this.file);
            document.body.appendChild(menu.dom)
        })

        this.subElements[1].dom.addEventListener("click", (e) => {
            //@ts-ignore
            let menu = new ExportMenu(this.parent.parent, this.file);
            document.body.appendChild(menu.dom)
        })
    }
}