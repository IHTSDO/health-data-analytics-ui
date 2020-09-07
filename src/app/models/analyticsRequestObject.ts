export class ReportDefinition {
    criteria: CohortCriteria;
    groups: [SubReportDefinition[]];
    name: string;

    constructor(criteria, groups, name) {
        this.criteria = criteria;
        this.groups = groups;
        this.name = name;
    }
}

export class SubReportDefinition {
    criteria: CohortCriteria;
    name: string;

    constructor(criteria, name) {
        this.criteria = criteria;
        this.name = name;
    }
}

export class CohortCriteria {
    gender: string;
    encounterCriteria: EncounterCriteria[];

    constructor(gender, encounterCriteria) {
        this.gender = gender;
        this.encounterCriteria = encounterCriteria;
    }
}

export class EncounterCriteria {
    conceptECL: string;

    constructor(conceptECL) {
        this.conceptECL = conceptECL;
    }
}







// export class Cohort {
//     gender: string;
//     encounterCriteria: EncounterCriteria[];
//
//     constructor(gender, encounterCriteria) {
//         this.gender = gender;
//         this.encounterCriteria = encounterCriteria;
//     }
// }
//
// export class EncounterCriteria {
//     conceptECL: string;
//
//     constructor(conceptECL) {
//         this.conceptECL = conceptECL;
//     }
// }
//
// export class Group {
//     criteria: Cohort;
// }

