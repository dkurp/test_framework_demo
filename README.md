# **THIS TESTS ARE NOT WORKING - CLEARED TESTED APP**

This is a project to show my usual way of working with test automation, it does not enter any testable page.

## Installing project

Run command `npm i` when in project's main catalog

## Headless mode testing

1. In project directory run command `npm run cy:run`
2. After test run is finished,a report is located in cypress/reports/reports.html

## Headed mode testing

1. In project directory run command `npm run cy:run-headed`
2. After test run is finished, a report is located in cypress/report/report.html
3. Open report.html in a browser

# Running tests with GUI

Cypress provides simple GUI for user.

1. In project directory run command `npm run cy:open`
2. Start preferred test file by clicking on its name

## CI/CD

There's one pipeline job scripted in .github\workflows\cypress_run.yml
For it to work it would be needed to be hosted on github, this is only for presentation
