export class Comparison {
    gender: string;
    disorders: Reference;
    controlGroup: boolean;
    comorbidities: Comorbidity[];
    comparators: Reference[];

    constructor(gender, disorders, comorbidities, comparators) {
        this.gender = gender;
        this.disorders = disorders;
        this.comorbidities = comorbidities;
        this.comparators = comparators;
    }
}

export class Reference {
    ecl: string;
    name: string;

    constructor(ecl) {
        this.ecl = ecl;
    }
}

export class Comorbidity {
    name: string;
    refinements: Reference[];

    constructor(refinements) {
        this.refinements = refinements;
    }
}
