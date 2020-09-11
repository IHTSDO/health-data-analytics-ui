export class GraphObject {
    name: string;
    series: DataPoint[];

    constructor(name, series) {
        this.name = name;
        this.series = series;
    }
}

export class DataPoint {
    name: string;
    value: number;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
