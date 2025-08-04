import IElement from "../../interfaces/iElement";
import UI from "../UI";
import Element from "./Element";

export default class Title extends Element implements IElement {
    dom = document.createElement("input");
    onTop = false;
    subElements: IElement[] = [];
    classes: string[] = [
        "fileinput"
    ];

    constructor(parent: Element | UI) {
        super(parent);
        this.dom.type = "file"
        this.init();
    }


}