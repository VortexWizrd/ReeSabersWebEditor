import IElement from "../interfaces/iElement";
import Title from "./Core/Title";
import Element from "./Core/Element";
import Button from "./Core/Button";
import TextInput from "./Core/TextInput";
import { ReeSaber } from "../../reesaberbuilder";
import FileInput from "./Core/FileInput";
import UI from "./UI";

export default class ImportMenu extends Element implements IElement {
    dom = document.createElement("div");
    subElements: Element[] = [
        new Title(this, "Import"),
        new FileInput(this),
        new Button(this, "Overwrite"),
        new Button(this, "Add Modules"),
    ];
    drag: HTMLElement | undefined;
    onTop = true;
    classes = ["float", "importmenu"];
    file: ReeSaber;
    inputFile: any;

    constructor(parent: Element | UI, file: ReeSaber) {
        super(parent);
        this.file = file
        this.drag = this.subElements[0].dom;
        this.init();

        this.subElements[1].dom.onchange = (e: any) => {
            this.inputFile = e.target.files[0];
            let fr = new FileReader();
            fr.onload = (event: any) => {
                console.log(event.target.result);
                let result = JSON.parse(event.target.result);
                this.inputFile = Object.assign(new ReeSaber, result);
                let formatted = JSON.stringify(result, null, 2);
            }
            fr.readAsText(this.inputFile);
        }


        this.subElements[2].dom.addEventListener("click", (e) => {
            this.file.import(this.inputFile);
            this.close();
        })

        this.subElements[3].dom.addEventListener("click", (e) => {
            this.file.importModules(this.inputFile);
            this.close();
        })
    }
}