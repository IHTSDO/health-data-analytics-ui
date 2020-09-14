import { Component, OnInit } from '@angular/core';
import 'jquery';
import { Title } from '@angular/platform-browser';
import { AuthoringService } from './services/authoring/authoring.service';
import { BranchingService } from './services/branching/branching.service';
import { Reference, Comparison, Comorbidity } from './models/comparison';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TerminologyServerService } from './services/terminologyServer/terminology-server.service';
import { HealthAnalyticsService } from './services/healthAnalytics/health-analytics.service';
import { CohortCriteria, EncounterCriteria, ReportDefinition, SubReportDefinition } from './models/analyticsRequestObject';
import { SnomedUtilityService } from './services/snomedUtility/snomed-utility.service';
import { Series, GraphObject } from './models/graphObject';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    graphData = [];

    // options
    colorScheme = {
        domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    };

    versions: object;
    environment: string;
    year: number = new Date().getFullYear();
    comparison: Comparison;

    // typeahead
    search = (text$: Observable<string>) => text$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
            if (term.length < 3) {
                return [];
            } else {
                return this.terminologyService.getTypeahead(term);
            }
        })
    )

    constructor(private authoringService: AuthoringService,
                private branchingService: BranchingService,
                private titleService: Title,
                private terminologyService: TerminologyServerService,
                private healthAnalyticsService: HealthAnalyticsService) {
    }

    ngOnInit() {
        this.titleService.setTitle('SNOMED CT Angular Template');
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];

        this.authoringService.getVersions().subscribe(versions => {
            this.versions = versions;
        });

        this.authoringService.getUIConfiguration().subscribe(config => {
            this.authoringService.uiConfiguration = config;
        });

        this.branchingService.setBranchPath('MAIN');
        this.assignFavicon();

        this.setupComparisonObject();
    }

    setupComparisonObject() {
        this.comparison = new Comparison(null, [], [], []);
        this.comparison.comparators.push(new Reference(''));
        this.comparison.comparators.push(new Reference(''));
        this.comparison.comorbidityCohort = 0;

        this.changeGender(null);
    }

    // GENDER FUNCTIONS
    changeGender(gender) {
        this.comparison.gender = gender;

        this.healthAnalyticsService.getCohort(new CohortCriteria(this.comparison.gender, [])).subscribe(data => {
            this.comparison.cohort = data['totalElements'];
            this.calculateComorbidityCohort();
        });

        this.changeCondition();
    }

    // CONDITION FUNCTIONS
    addCondition(type) {
        this.comparison.condition.push(new Reference('', type));
    }

    changeCondition() {
        const encounterCriteria = [];

        this.comparison.condition.forEach(item => {
            item.ecl = this.addECLPrefix(item.ecl);
            encounterCriteria.push(new EncounterCriteria(item.ecl));
        });

        this.healthAnalyticsService.getCohort(new CohortCriteria(this.comparison.gender, encounterCriteria)).subscribe(data => {
            this.comparison.conditionCohort = data['totalElements'];
            this.calculateComorbidityCohort();
        });
    }

    exists(name) {
        return this.comparison.condition.find(item => {
            return item.type === name;
        });
    }

    // COMPARATOR FUNCTIONS
    addComparator() {
        this.comparison.comparators.push(new Reference(''));
    }

    assignComparatorName(comparator) {
        comparator.name = SnomedUtilityService.getPreferredTermFromFsn(comparator.ecl);
    }

    changeComparator(comparator) {
        this.assignComparatorName(comparator);
        comparator.ecl = this.addECLPrefix(comparator.ecl);
    }


    // COMORBIDITY FUNCTIONS
    addComorbidity() {
        this.comparison.comorbidities.push(new Comorbidity([new Reference('')]));
    }

    addComorbidityReference(comorbidity) {
        comorbidity.refinements.push(new Reference(''));
    }

    assignComorbidityName(comorbidity) {
        comorbidity.name = '';

        comorbidity.refinements.forEach(item => {
            item.name = SnomedUtilityService.getPreferredTermFromFsn(item.ecl);
            comorbidity.name += item.name + ', ';
        });

        comorbidity.name = comorbidity.name.substring(0, comorbidity.name.length - 2);
    }

    changeComorbidity(comorbidity) {
        this.assignComorbidityName(comorbidity);
        comorbidity.ecl = this.addECLPrefix(comorbidity.ecl);

        // Create new Report for submission to API
        const reportDefinition = new ReportDefinition(null, [], 'COVID-19 Comorbidity Affects');

        // Create new Criteria for the Report
        const encounterCriteria = [];

        this.comparison.condition.forEach(item => {
            encounterCriteria.push(new EncounterCriteria(item.ecl));
        });

        reportDefinition.criteria = new CohortCriteria(this.comparison.gender, encounterCriteria);

        // Create new Comorbidity array for the groups array
        const comorbidityArray = [];

        this.comparison.comorbidities.forEach(item => {
            const comorbidityEncounterCriteria = [];

            item.refinements.forEach(nestedItem => {
                nestedItem.ecl = this.addECLPrefix(nestedItem.ecl);
                comorbidityEncounterCriteria.push(new EncounterCriteria(nestedItem.ecl));
            });

            comorbidityArray.push(new SubReportDefinition(new CohortCriteria(
                this.comparison.gender, comorbidityEncounterCriteria), item.name));
        });

        // Create new control group object for comorbidity array
        const controlGroupEncounterCriteria = [];

        this.comparison.comorbidities.forEach(item => {

            item.refinements.forEach(nestedItem => {
                controlGroupEncounterCriteria.push(new EncounterCriteria(nestedItem.ecl, false));
            });
        });

        const controlGroup = new SubReportDefinition(new CohortCriteria(this.comparison.gender, controlGroupEncounterCriteria), 'Control Group');

        comorbidityArray.unshift(controlGroup);

        reportDefinition.groups.push(comorbidityArray);

        // Create new Comparator array for the groups array

        const comparatorArray = [];

        this.comparison.comparators.forEach(item => {
            if (item.ecl) {
                comparatorArray.push(new SubReportDefinition(new CohortCriteria(
                    this.comparison.gender, [new EncounterCriteria(item.ecl)]), item.name));
            }
        });

        reportDefinition.groups.push(comparatorArray);

        this.healthAnalyticsService.getReport(reportDefinition).subscribe(data => {

            let comorbidityCohort = 0;

            data['groups'].forEach(item => {
                this.comparison.comorbidities.forEach(response => {
                    if (response.name === item.name) {
                        response.patientCount = item['patientCount'];
                    }
                });

                if (item.name === 'Control Group') {
                    comorbidityCohort = item.patientCount;
                }
            });

            this.calculateComorbidityCohort(comorbidityCohort);
        });
    }

    calculateComorbidityCohort(comorbidityCohort?) {
        if (comorbidityCohort) {
            this.comparison.comorbidityCohort = comorbidityCohort;
        } else {
            let count = this.comparison.conditionCohort;
            this.comparison.comorbidities.forEach(item => {

                count -= item.patientCount;
            });

            this.comparison.comorbidityCohort = count;
        }
    }

    // GRAPH FUNCTIONS
    showInsight() {
        // Create new Report for submission to API
        const reportDefinition = new ReportDefinition(null, [], 'COVID-19 Comorbidity Affects');

        // Create new Criteria for the Report
        const encounterCriteria = [];

        this.comparison.condition.forEach(item => {
            encounterCriteria.push(new EncounterCriteria(item.ecl));
        });

        reportDefinition.criteria = new CohortCriteria(this.comparison.gender, encounterCriteria);

        // Create new Comorbidity array for the groups array
        const comorbidityArray = [];

        this.comparison.comorbidities.forEach(item => {
            const comorbidityEncounterCriteria = [];

            item.refinements.forEach(nestedItem => {
                comorbidityEncounterCriteria.push(new EncounterCriteria(nestedItem.ecl));
            });

            comorbidityArray.push(new SubReportDefinition(new CohortCriteria(
                this.comparison.gender, comorbidityEncounterCriteria), item.name));
        });

        // Create new control group object for comorbidity array
        const controlGroupEncounterCriteria = [];

        this.comparison.comorbidities.forEach(item => {

            item.refinements.forEach(nestedItem => {
                controlGroupEncounterCriteria.push(new EncounterCriteria(nestedItem.ecl, false));
            });
        });

        const controlGroup = new SubReportDefinition(new CohortCriteria(this.comparison.gender, controlGroupEncounterCriteria), 'Control Group');

        comorbidityArray.unshift(controlGroup);

        reportDefinition.groups.push(comorbidityArray);

        // Create new Comparator array for the groups array

        const comparatorArray = [];

        this.comparison.comparators.forEach(item => {
            if (item.ecl) {
                comparatorArray.push(new SubReportDefinition(new CohortCriteria(
                    this.comparison.gender, [new EncounterCriteria(item.ecl)]), item.name));
            }
        });

        reportDefinition.groups.push(comparatorArray);

        this.healthAnalyticsService.getReport(reportDefinition).subscribe(data => {

            this.buildGraph(data);
        });
    }

    buildGraph(dataSet) {
        console.log('RAW: ', dataSet);

        const graphData = [];

        dataSet.groups.forEach(data => {
            const seriesSet = [];

            data.groups.forEach(item => {
                seriesSet.push(new Series(item.name, item.patientCount));
            });

            graphData.push(new GraphObject( data.name, seriesSet));
        });

        console.log('GRAPHDATA: ', graphData);

        this.graphData = graphData;
    }

    // UTILITY FUNCTIONS
    addECLPrefix(ecl) {
        if (ecl && ecl.substring(0, 2) !== '<<') {
            return '<<' + ecl;
        } else {
            return ecl;
        }
    }

    onSelect(data): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    assignFavicon() {
        const favicon = $('#favicon');

        switch (this.environment) {
            case 'local':
                favicon.attr('href', 'favicon_grey.ico');
                break;
            case 'dev':
                favicon.attr('href', 'favicon_red.ico');
                break;
            case 'uat':
                favicon.attr('href', 'favicon_green.ico');
                break;
            case 'training':
                favicon.attr('href', 'favicon_yellow.ico');
                break;
            default:
                favicon.attr('href', 'favicon.ico');
                break;
        }
    }
}
