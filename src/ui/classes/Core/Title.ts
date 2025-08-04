import IElement from "../../interfaces/iElement";
import UI from "../UI";
import Element from "./Element";

export default class Title extends Element implements IElement {
    dom = document.createElement("h1");
    onTop = false;
    subElements: IElement[] = [];
    classes: string[] = [
        "title"
    ];

    constructor(parent: Element | UI, value: String) {
        super(parent);
        this.init();
        this.dom.innerHTML = String(value);
    }
}