/// <reference types="cypress" />
import selectors from '../../support/selectors'
import { SERVICE_URL, SERVICE_TAG, SERVICE_DEFAULT_READ_TIMEOUT, SERVICE_CUSTOM_READ_TIMEOUT } from '@/support/testData'

const serviceUrl = SERVICE_URL;
const serviceTag = SERVICE_TAG;
const serviceDefaultReadTimeout = SERVICE_DEFAULT_READ_TIMEOUT;
const serviceCustomReadTimeout = SERVICE_CUSTOM_READ_TIMEOUT;

describe('Kong gateway UI test/service/normal', () => {
  // Shared navigation: ensure we start each test on the "New Gateway Service" form
  beforeEach(() => {
    cy.get(selectors.workspaceLinkDefault).should('be.visible').click();
    cy.get(selectors.sidebarToggle).should('be.visible').click();
    cy.get(selectors.sidebarGatewayServices).should('be.visible').click();
    cy.get(selectors.addGatewayService).should('be.visible').click();
  });

  // Cleanup created service after tests
  afterEach(() => {
    // Service cleanup (if created)
    cy.get('@serviceId').then((serviceId) => {
      if (serviceId) {
        return cy.apiDeleteService(String(serviceId));
      }
    });
  });

  // Create service with full URL and default
  it('Create service with full URL and default', () => {
    // (navigation performed by describe-level beforeEach)

    // Fill in service full url
    cy.get(selectors.gatewayServiceUrlInput).type(serviceUrl);

    // Expand and verify auto filled advanced fields
    cy.get(selectors.advancedFieldsCollapse)
      .find(selectors.advancedCollapseTrigger)
      .click();
    cy.get(selectors.gatewayServiceReadTimeoutInput)
      .should('be.visible').should('have.value', serviceDefaultReadTimeout.toString());

    // Get generated service name and store it as a string alias
    cy.get(selectors.gatewayServiceNameInput).click(); // implicit auto scroll into view
    cy.get(selectors.gatewayServiceNameInput)
      .should('be.visible')
      .invoke('val')
      .then((val) => {
        const svcName = String(val);
        cy.wrap(svcName).as('serviceName');
      });

    // Submit to create service
    cy.get(selectors.serviceCreateFormSubmit).click();

    // Verify API request payload
    cy.get('@serviceName').then((serviceName) => {
      const svcName = String(serviceName);
      cy.wait('@createService').then((interception) => {
        // Verify request body
        const requestBody = interception.request.body;
        expect(requestBody.name).to.eq(svcName);
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
      cy.get(selectors.namePropertyValue).should('be.visible').should('have.text', svcName);
    });
  })

  // Create service with URL components and advanced options
  it('Create service with URL components and advanced options', () => {
    // (navigation performed by describe-level beforeEach)

    // Switch to URL components input mode
    cy.get(selectors.gatewayServiceProtocolRadio).click();

    // Fill in service URL components
    const url = new URL(serviceUrl);
    cy.get(selectors.gatewayServiceHostInput).type(url.hostname);
    cy.get(selectors.gatewayServicePathInput).type(url.pathname);

    // Expand and verify auto filled advanced fields
    cy.get(selectors.advancedFieldsCollapse)
      .find(selectors.advancedCollapseTrigger)
      .click();
    cy.get(selectors.gatewayServiceReadTimeoutInput)
      .should('be.visible').should('have.value', serviceDefaultReadTimeout.toString()).type('{selectall}').type(serviceCustomReadTimeout.toString());

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
        expect(requestBody.read_timeout).to.eq(serviceCustomReadTimeout);
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
      cy.get(selectors.namePropertyValue).should('be.visible').should('have.text', svcName);
    });
  })
})