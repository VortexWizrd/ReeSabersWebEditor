import { ReeSaber } from "../../../reesaberbuilder";
import IElement from "../../interfaces/iElement";
import UI from "../UI";
import Button from "./Button";
import Element from "./Element";

export default class ContextMenu extends Element implements IElement {
    dom = document.createElement("div");
    onTop = true;
    subElements: IElement[] = [];
    classes = [
        "contextmenu"
    ];

    constructor(parent: Element | UI) {
        super(parent);
        this.init();
    }
}