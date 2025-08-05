export default interface IVector3 {
    x: number,
    y: number,
    z: number,

    sum(...vecs: IVector3[]): IVector3
}