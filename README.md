[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/IHTSDO/health-data-analytics-ui.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/IHTSDO/health-data-analytics-ui/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/IHTSDO/health-data-analytics-ui.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/IHTSDO/health-data-analytics-ui/alerts/)

# Health Data Analytics Demonstrator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via Jest.

## Example nginx configuration

The / location is used to proxy your configured port to the angular live reload server started via ng serve. 

```
user 'details here';
worker_processes  1;

events {
    worker_connections  1024;
}
 
http {
    server {
        listen      ****;

        location / {
            proxy_pass http://127.0.0.1:4200;
        }
        
        location /concepts {
            proxy_pass localSnowstormInstance;
        }
        
        location /health-analytics-api {
            proxy_pass localHealthDataInstance;
        }
    }	
}

```

## Back end dependencies 

This Frontend application makes use of [Snowstorm](https://github.com/IHTSDO/snowstorm) for concept lookup and [Health Data Analytics](https://github.com/IHTSDO/health-data-analytics) for report generation and analysis.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
