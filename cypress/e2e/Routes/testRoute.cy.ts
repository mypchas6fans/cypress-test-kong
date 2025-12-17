/// <reference types="cypress" />
import selectors from '../../support/selectors'
import { SERVICE_URL } from '@/support/testData'

const serviceUrl = SERVICE_URL;
const timestamp = Date.now();
const serviceName = `new-service-for-route-${timestamp}`;
const routeName = `route-${timestamp}`;
const routeUrl = `/test-route-${timestamp}`;

describe('Kong gateway UI test/route/normal', () => {

    // Ensure a service exists for routes tests
    before(() => {
        const url = Cypress.env('apiBaseUrl') + '/default/services';
        // Load base payload from fixtures and set dynamic fields (name & url)
        cy.fixture('createService.json').then((base) => {
            const payload = { ...base, name: serviceName, url: serviceUrl };

            // Try create (if already exists, try to locate it)
            cy.apiCreateService(payload).then((id) => {
                cy.wrap(id).as('serviceId');
            });
        });
    });

    // Cleanup created service and route (safe: skip if alias not set)
    after(() => {
        // Route cleanup (if created)
        cy.then(() => {
            cy.get('@routeId').then((routeId) => {
                if (routeId) {
                    return cy.apiDeleteRoute(String(routeId));
                }
            });
        });

        // Service cleanup (if created)
        cy.get('@serviceId').then((serviceId) => {
            if (serviceId) {
                return cy.apiDeleteService(String(serviceId));
            }
        });
    });

    // Create route
    it('Create route', () => {
        // Click default workspace
        cy.get(selectors.workspaceLinkDefault).click();

        // Click top left toggle
        cy.get(selectors.sidebarToggle).click();

        // Click Routes in sidebar
        cy.get(selectors.sidebarRoutes).click();

        // Click new route button
        cy.get(selectors.addRoute).click();

        // Fill in route name
        cy.get(selectors.routeNameInput).type(routeName);

        // Select service
        cy.get('@serviceId').then((serviceId) => {
            const svcId = String(serviceId);
            cy.get(selectors.routeServiceSelect).click();
            cy.get('[data-testid="select-item-' + svcId + '"]').click();
        });

        // Fill in paths
        cy.get(selectors.routePathsInput).type(routeUrl);

        // Inspect form state and submit to create route
        cy.get(selectors.routeCreateFormSubmit).click();

        // Verify API request and response
        cy.get('@serviceId').then((serviceId) => {
            const svcId = String(serviceId);
            cy.wait('@createRoute').then((interception) => {
                // Debug request body
                cy.log('createRoute request body:', JSON.stringify(interception.request.body));
                // Verify request body
                const requestBody = interception.request.body;
                expect(requestBody.name).to.eq(routeName);
                expect(requestBody.paths).to.deep.eq([routeUrl]);
                expect(requestBody.service, 'service should be set in route creation request').to.not.be.null;
                expect(requestBody.service.id).to.eq(svcId);

                // Verify response body
                const responseBody = interception.response!.body;
                expect(responseBody.name).to.eq(routeName);
                expect(responseBody.paths).to.deep.eq([routeUrl]);
                expect(responseBody.service).to.have.property('id', svcId);
                const routeId: string = responseBody.id;
                // store created route id for later navigation
                cy.wrap(routeId).as('routeId');
            });
        });

        // Verify navigation to route detail page
        cy.get('@routeId').then((routeId) => {
            const routeIdStr = String(routeId);
            cy.url().should('include', `/default/routes/${routeIdStr}`);
        });
        // Wait for details to load and capture response for debugging
        cy.wait('@loadRouteDetail').then((interception) => {
            cy.log('loadRouteDetail response:', JSON.stringify(interception.response && interception.response.body));
        });

        // Verify route details display
        cy.get(selectors.namePropertyValue).should('be.visible').then(($el) => {
            const val = $el.val();
            const text = $el.text().trim();
            const actual = (typeof val !== 'undefined' && val !== null && String(val) !== '') ? String(val) : text;
            expect(actual).to.eq(routeName);
        });

    })
})