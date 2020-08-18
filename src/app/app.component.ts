import { Component, OnInit } from '@angular/core';
import 'jquery';
import { Title } from '@angular/platform-browser';
import { AuthoringService } from './services/authoring/authoring.service';
import { BranchingService } from './services/branching/branching.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    versions: object;
    environment: string;

    constructor(private authoringService: AuthoringService,
                private branchingService: BranchingService,
                private titleService: Title) {

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
