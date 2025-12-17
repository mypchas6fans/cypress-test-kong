/// <reference types="cypress" />
import selectors from '../../support/selectors'
import { SERVICE_URL } from '@/support/testData'

const serviceUrl = SERVICE_URL;

describe('Kong gateway UI test/service/negative', () => {
  // Shared navigation: ensure we start each test on the "New Gateway Service" form
  beforeEach(() => {
    cy.get(selectors.workspaceLinkDefault).should('be.visible').click();
    cy.get(selectors.sidebarToggle).should('be.visible').click();
    cy.get(selectors.sidebarGatewayServices).should('be.visible').click();
    cy.get(selectors.addGatewayService).should('be.visible').click();
  });

  // Add service form input check
  it('Add service form input check', () => {
    cy.get(selectors.serviceCreateFormSubmit).should('be.disabled');
    // Fill in service full url
    cy.get(selectors.gatewayServiceUrlInput).type(serviceUrl);
    cy.get(selectors.serviceCreateFormSubmit).should('be.enabled');
    cy.get(selectors.gatewayServiceUrlInput).type('{selectall}').type('invalid-url');
    cy.get(selectors.serviceCreateFormSubmit).should('be.disabled');
  
    // Switch to URL components input mode
    cy.get(selectors.gatewayServiceProtocolRadio).click();

    // Fill in service URL components
    const url = new URL(serviceUrl);
    
    cy.get(selectors.gatewayServiceHostInput).type('---');
    cy.get(selectors.serviceCreateFormSubmit).should('be.disabled');
    cy.get(selectors.gatewayServiceHostInput).type('{selectall}').type(url.hostname);
    cy.get(selectors.serviceCreateFormSubmit).should('be.enabled');
  })
})