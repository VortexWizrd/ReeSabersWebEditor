import IElement from "../../interfaces/iElement";
import UI from "../UI";
import Element from "./Element";

export default class Title extends Element implements IElement {
    dom = document.createElement("input");
    onTop = false;
    subElements: IElement[] = [];
    classes: string[] = [
        "textinput"
    ];

    constructor(parent: Element | UI, value: String) {
        super(parent);
        this.init();
        this.dom.placeholder = String(value);

        this.dom.addEventListener('keyup', function (e) {

            e.stopPropagation();
          
        }, false);
        this.dom.addEventListener('keydown', function (e) {
          
            e.stopPropagation();
          
        }, false);
          
    }


}