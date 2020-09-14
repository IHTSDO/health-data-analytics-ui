export class GraphObject {
    name: string;
    series: Series[];

    constructor(name, series) {
        this.name = name;
        this.series = series;
    }
}

export class Series {
    name: string;
    value: number;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
