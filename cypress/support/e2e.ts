/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';
import './command';

// import '@cypress/xpath'; // if using cypress-xpath plugin

// Global setup used by most specs. If a spec needs custom setup, it can define its own local hooks.
beforeEach(() => {
  // Visit base URL and verify main workspace screen
  cy.visit('/')
  cy.url().should('eq', Cypress.config('baseUrl') + '/workspaces')
  cy.title().should('eq', 'Workspaces | Kong Manager')

  // Shared intercepts
  cy.intercept('POST', Cypress.env('apiBaseUrl') + '/default/services').as('createService')
  cy.intercept('GET', Cypress.env('apiBaseUrl') + '/default/services/*').as('loadServiceDetail')
  cy.intercept('POST', Cypress.env('apiBaseUrl') + '/default/routes').as('createRoute')
  cy.intercept('GET', Cypress.env('apiBaseUrl') + '/default/routes/*').as('loadRouteDetail')
})

// Optional global cleanup/logging
afterEach(() => {
  cy.log('test case execution completed')
})

export {}