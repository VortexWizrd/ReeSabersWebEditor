import { ReeSaber } from "../../../reesaberbuilder";
import IElement from "../../interfaces/iElement";
import Button from "../Core/Button";
import ContextMenu from "../Core/ContextMenu";
import Element from "../Core/Element";
import UI from "../UI";
import FileContext from "./FileContext";

export default class TopBar extends Element implements IElement {
    dom = document.createElement("div");
    onTop = true;
    subElements: IElement[] = [
        new Button(this, "File")
    ];
    classes = ["topbar"];
    file: ReeSaber;

    constructor(parent: Element | UI, file: ReeSaber) {
        super(parent);
        this.init();
        this.file = file;
        
        this.subElements[0].dom.addEventListener("click", (e) => {  
            while (this.contextExists() !== -1) {
                let existingMenu = this.contextExists();
                this.subElements[existingMenu].close();
                this.subElements.splice(existingMenu, 1);
            }

            
            let menu = new FileContext(this, this.file);
            menu.dom.style.top = `${this.dom.offsetHeight + this.dom.offsetTop}px`;
            this.subElements.push(menu);
            this.appendElements();
        })
    }

    contextExists(): number {
        for (let i = 0; i < this.subElements.length; i++) {
            if (this.subElements[i] instanceof ContextMenu) {
                return i;
            }
        }
        return -1;
    }
    

}