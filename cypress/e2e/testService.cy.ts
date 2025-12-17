/// <reference types="cypress" />
import selectors from '../support/selectors'

const serviceUrl = 'http://mockbin.org/request';
const serviceTag = 'tag1';
const serviceDefaultReadTimeout = 60000;

describe('Kong gateway UI test/service', () => {

  // Cleanup created service after tests
  after(() => {
    // Service cleanup (if created)
    cy.get('@serviceId').then((serviceId) => {
      if (serviceId) {
        return cy.apiDeleteService(String(serviceId));
      }
    });
  });

  // Create service in default workspace
  it('Create service in default workspace', () => {
    // Click default workspace
    cy.get(selectors.workspaceLinkDefault).should('be.visible').click();

    // Click top left toggle
    cy.get(selectors.sidebarToggle).should('be.visible').click();

    // Click Gateway Services in sidebar and wait for the services page
    cy.get(selectors.sidebarGatewayServices).should('be.visible').click();

    // Click New gateway service button
    cy.get(selectors.addGatewayService).should('be.visible').click();

    // Fill in service full url
    cy.get(selectors.gatewayServiceUrlInput).type(serviceUrl);

    // Expand and verify auto filled advanced fields
    cy.get(selectors.advancedFieldsCollapse)
      .find(selectors.advancedCollapseTrigger)
      .click();
    cy.get(selectors.gatewayServiceRetriesInput)
      .should('be.visible').should('have.value', '5');

    // Get generated service name and store it as a string alias
    cy.get(selectors.gatewayServiceNameInput).click(); // implicit auto scroll into view
    cy.get(selectors.gatewayServiceNameInput)
      .should('be.visible')
      .invoke('val')
      .then((val) => {
        const svcName = String(val);
        cy.wrap(svcName).as('serviceName');
      });

    // Expand and add tags
    cy.get(selectors.tagsCollapse)
      .find(selectors.advancedCollapseTrigger)
      .click();
    cy.get(selectors.gatewayServiceTagsInput).type(serviceTag);

    // Submit to create service
    cy.get(selectors.serviceCreateFormSubmit).click();

    // Verify API request payload
    cy.get('@serviceName').then((serviceName) => {
      const svcName = String(serviceName);
      cy.wait('@createService').then((interception) => {
        // Verify request body
        const requestBody = interception.request.body;
        expect(requestBody.name).to.eq(svcName);
        expect(requestBody.tags).to.deep.eq([serviceTag]);
        expect(requestBody.url).to.eq(serviceUrl);
        expect(requestBody.read_timeout).to.eq(serviceDefaultReadTimeout);
        expect(requestBody.enabled).to.be.true;

        // Verify response body
        expect(interception.response).to.not.be.undefined;
        const response = interception.response!;
        expect(response.statusCode).to.eq(201); // 201 Created
        const serviceId: string = response.body.id;
        // store created service id for later navigation
        cy.wrap(serviceId).as('serviceId');
        expect(response.body.name).to.eq(svcName);
        expect(response.body.tags).to.deep.eq(requestBody.tags);
        // expect(response.body.url).to.eq(requestBody.url);
      });
    });

    cy.get('@serviceId').then((serviceId) => {
      const svcId = String(serviceId);
      cy.url().should('include', `/default/services/${svcId}`);
    });
    // Wait for details to load and capture response for debugging
    cy.wait('@loadServiceDetail').then((interception) => {
      cy.log('loadServiceDetail response:', JSON.stringify(interception.response && interception.response.body));
    });

    // Verify service details display - accept either input value or text content
    cy.get('@serviceName').then((serviceName) => {
      const svcName = String(serviceName);
      cy.get(selectors.namePropertyValue).should('be.visible').then(($el) => {
        const val = $el.val();
        const text = $el.text().trim();
        const actual = (typeof val !== 'undefined' && val !== null && String(val) !== '') ? String(val) : text;
        expect(actual).to.eq(svcName);
      });
    });
  })
})