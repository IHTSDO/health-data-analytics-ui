import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HealthAnalyticsService {

    constructor(private http: HttpClient) {
    }

    getCohort(params) {
        return this.http.post('/health-analytics-api/cohorts/select', params);
    }

    getReport(params) {
        return this.http.post('/health-analytics-api/report', params);
    }
}
