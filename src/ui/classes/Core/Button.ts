import IElement from "../../interfaces/iElement";
import UI from "../UI";
import Element from "./Element";

export default class Button extends Element implements IElement {
    dom = document.createElement("button");
    onTop = false;
    subElements: IElement[] = [];
    classes: string[] = [
        "button"
    ];

    constructor(parent: Element | UI, value: String) {
        super(parent);
        this.init();
        this.dom.innerHTML = String(value);
    }
}