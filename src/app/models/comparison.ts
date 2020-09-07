export class Comparison {
    gender: string;
    cohort: string;
    disorder: Reference;
    comorbidities: Comorbidity[];
    comparators: Reference[];

    constructor(gender, disorder, comorbidities, comparators) {
        this.gender = gender;
        this.disorder = disorder;
        this.comorbidities = comorbidities;
        this.comparators = comparators;
    }
}

export class Reference {
    ecl: string;
    name: string;
    cohort: string;

    constructor(ecl) {
        this.ecl = ecl;
    }
}

export class Comorbidity {
    name: string;
    refinements: Reference[];
    patientCount: number;

    constructor(refinements) {
        this.refinements = refinements;
    }
}
