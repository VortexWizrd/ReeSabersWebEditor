import IElement from "../interfaces/iElement";
import Title from "./Core/Title";
import Element from "./Core/Element";
import TextInput from "./Core/TextInput";
import Button from "./Core/Button";
import { ReeSaber } from "../../reesaberbuilder";
import UI from "./UI";

export default class ExportMenu extends Element implements IElement {
    dom = document.createElement("div");
    subElements: Element[] = [
        new Title(this, "Export as..."),
        new TextInput(this, "NewPreset"),
        new Button(this, "Cancel"),
        new Button(this, "Export"),
    ];
    drag: HTMLElement | undefined;
    onTop = true;
    classes = ["float", "exportmenu"];
    file: ReeSaber

    constructor(parent: Element | UI, file: ReeSaber) {
        super(parent);
        this.file = file;
        this.drag = this.subElements[0].dom;
        this.init();

        this.subElements[2].dom.addEventListener("click", (e) => {
            this.close();
        })

        this.subElements[3].dom.addEventListener("click", (e) => {

            //@ts-ignore
            let name = this.subElements[1].dom.value
            if (name) {
                this.file.export(name);
                this.close();
            } else {
                this.file.export("NewPreset");
                this.close();
            }
            
        })
    }
    
}