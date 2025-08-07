import * as THREE from 'three';
import { BlurSaberModule, ReeSaber } from '../../reesaberbuilder';

export default interface IViewport {
    file: ReeSaber,

    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    model: THREE.Group,

    createDragListener(): void,

    createMovementListener(): void,

    clearModel(): void,

    calculateVertices(module: BlurSaberModule, interpolationType: number): number[],

    loadModel(): void,
    
    resizeWindow(): void,

}