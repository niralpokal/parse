export interface parsedPage {
    page: number,
    groups: ExtractedRow[][]
}
export interface ExtractedRow {
    text:string,
    row?:number,
    matrix: [number],
    localBBox: [number],
    globalBBox: [number]
}
export interface Math {
    sign(x:number):number
}