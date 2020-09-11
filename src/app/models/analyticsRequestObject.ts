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
    has: boolean;

    constructor(conceptECL, has?) {
        this.conceptECL = conceptECL;
        this.has = has;
    }
}

const fakeData2 = [
    {
        'name': 'COVID-19 Comorbidity Affects',
        'criteria': {
            'encounterCriteria': [
                {
                    'conceptECL': '<<840539006|COVID-19|',
                    'has': true
                }
            ]
        },
        'groups': [
            [
                {
                    'name': 'Obesity',
                    'criteria': {
                        'encounterCriteria': [
                            {
                                'conceptECL': '<<414916001|Obesity|'
                            }
                        ]
                    }
                },
                {
                    'name': 'Diabetes',
                    'criteria': {
                        'encounterCriteria': [
                            {
                                'conceptECL': '<<73211009|Diabetes|'
                            }
                        ]
                    }
                },
                {
                    'name': 'Hypertensive disorder',
                    'criteria': {
                        'encounterCriteria': [
                            {
                                'conceptECL': '<<38341003|Hypertensive disorder|'
                            }
                        ]
                    }
                },
                {
                    'name': 'Control Group',
                    'criteria': {
                        'encounterCriteria': [
                            {
                                'has': false,
                                'conceptECL': '<<414916001|Obesity|'
                            },
                            {
                                'has': false,
                                'conceptECL': '<<73211009|Diabetes|'
                            },
                            {
                                'has': false,
                                'conceptECL': '<<38341003|Hypertensive disorder|'
                            }
                        ]
                    }
                }
            ],
            [
                {
                    'name': 'COVID-19 pneumonia',
                    'criteria': {
                        'encounterCriteria': [
                            {
                                'conceptECL': '<<882784691000119100|COVID-19 pneumonia|'
                            }
                        ]
                    }
                },
                {
                    'name': 'Died',
                    'criteria': {
                        'encounterCriteria': [
                            {
                                'conceptECL': '<<419099009|Died|'
                            }
                        ]
                    }
                }
            ]
        ]
    }
];
