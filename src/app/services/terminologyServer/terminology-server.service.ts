import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthoringService } from '../authoring/authoring.service';
import { BranchingService } from '../branching/branching.service';
import { map } from 'rxjs/operators';
import { SnomedUtilityService } from '../snomedUtility/snomed-utility.service';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    private branchPath: string;
    private branchPathSubscription: Subscription;

    constructor(private http: HttpClient,
                private authoringService: AuthoringService,
                private branchingService: BranchingService) {
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => this.branchPath = data);
    }

    getTypeahead(term) {
        return this.http
            .get(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
                '/concepts?activeFilter=true&termActive=true&limit=20&term=' + term)
            .pipe(map(responseData => {
                const typeaheads = [];

                responseData['items'].forEach((item) => {
                    typeaheads.push(SnomedUtilityService.convertShortConceptToString(item));
                });

                return typeaheads;
            }));
    }

    getConcept(id): Observable<object> {
        return this.http.get<object>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath
            + '/concepts/' + id);
    }
}
