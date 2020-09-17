export class Comparison {
    gender: string;
    condition: Reference[];
    comorbidities: Comorbidity[];
    comparators: Reference[];
    cohort: number;
    conditionCohort: number;
    comorbidityCohort: number;


    constructor(gender, condition, comorbidities, comparators) {
        this.gender = gender;
        this.condition = condition;
        this.comorbidities = comorbidities;
        this.comparators = comparators;
    }
}

export class Reference {
    ecl: string;
    name: string;
    type: string;
    color: string;

    constructor(ecl, type?) {
        this.ecl = ecl;
        this.type = type;
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
