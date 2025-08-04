import IElement from "../../interfaces/iElement";
import UI from "../UI";

export default class Element implements IElement {
    dom: HTMLElement = document.createElement("div");
    drag?: HTMLElement | undefined;
    onTop: boolean = false;
    subElements: IElement[] = [];
    classes: string[] = [];
    parent: Element | UI

    constructor(parent: Element | UI) {
        this.parent = parent
    }

    appendElements(): void {
        for (let element in this.subElements) {
            this.dom.appendChild(this.subElements[element].dom)
        }
    }

    addClasses(): void {
        for (let i in this.classes) {
            this.dom.classList.add(this.classes[i]);
        }

        for (let i in this.subElements) {
            this.subElements[i].classes.push("e" + i);
            this.subElements[i].addClasses();
        }
    }

    close(): void {
        this.dom.remove();
    }
    
    createDragListener(): void {
        if (!this.drag) return;

        this.drag.addEventListener("mousedown", (e) => {

            if (e.button != 0) return;

            const move = (event: any) => {
                this.dom.style.top = `${this.dom.offsetTop + event.movementY}px`;
                this.dom.style.left = `${this.dom.offsetLeft + event.movementX}px`;
                this.dom.style.cursor = "move";
            }

            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", move);
                this.dom.style.cursor = "auto";
            })
            window.addEventListener("mouseleave", () => {
                window.removeEventListener("mousemove", move);
                this.dom.style.cursor = "auto";
            })
        })
    }

    init(): void {
        this.appendElements();
        this.parent.subElements.push(this);
        this.addClasses();
        this.createDragListener();
    }
    
}