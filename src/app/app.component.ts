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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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
        this.comparison = new Comparison(null, new Reference(''), [], []);
        this.comparison.comparators.push(new Reference(''));
        this.comparison.comparators.push(new Reference(''));

        this.changeGender(null);
    }

    changeGender(gender) {
        this.comparison.gender = gender;

        this.healthAnalyticsService.getCohort(new CohortCriteria(this.comparison.gender, [])).subscribe(data => {
            this.comparison.cohort = data['totalElements'];
        });

        if (this.comparison.disorder.ecl) {
            this.changeDisorder(this.comparison.disorder.ecl);
        }
    }

    changeDisorder(disorder) {
        this.healthAnalyticsService.getCohort(new CohortCriteria(this.comparison.gender, [new EncounterCriteria(disorder)]))
            .subscribe(data => {
            this.comparison.disorder.cohort = data['totalElements'];
        });
    }

    changeComorbidity(comorbidity) {
        comorbidity.name = '';

        comorbidity.refinements.forEach(item => {
            item.name = SnomedUtilityService.getPreferredTermFromFsn(item.ecl);
            comorbidity.name += item.name + ', ';
        });

        comorbidity.name = comorbidity.name.substring(0, comorbidity.name.length - 2);

        ////////////////////

        const reportDefinition = new ReportDefinition(null, [[]], '');

        reportDefinition.criteria = new CohortCriteria(this.comparison.gender, [new EncounterCriteria(this.comparison.disorder.ecl)]);

        comorbidity.refinements.forEach(item => {
            reportDefinition.groups[0].push(new SubReportDefinition(new CohortCriteria(
                this.comparison.gender, [new EncounterCriteria(item.ecl)]), ''));
        });

        this.healthAnalyticsService.getReport(reportDefinition).subscribe(data => {

            let count = 0;
            data['groups'].forEach((item, index) => {
                count += item.patientCount;
            });
            comorbidity.patientCount = count;
        });
    }

    addComorbidity() {
        this.comparison.comorbidities.push(new Comorbidity([new Reference('')]));
    }

    addRefinement(comorbidity) {
        comorbidity.refinements.push(new Reference(''));
    }

    addComparator() {
        this.comparison.comparators.push(new Reference(''));
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
