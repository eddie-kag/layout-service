export default interface Polygon {
    type: 'Polygon',
    coordinates: number[][]
    crs: {
        type: string,
        properties: {
            name: string
        }
    }
}