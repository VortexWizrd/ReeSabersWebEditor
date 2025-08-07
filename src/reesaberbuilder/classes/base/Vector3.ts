import IVector3 from "../../interfaces/base/iVector3";

export default class Vector3 implements IVector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z
    }

    sum(...vecs: Vector3[]): Vector3 {
        let sum = new Vector3(0, 0, 0);

        for (let i in vecs) {
            sum.x += vecs[i].x;
            sum.y += vecs[i].y;
            sum.z += vecs[i].z;
        }

        return sum;
    }

    
    
}