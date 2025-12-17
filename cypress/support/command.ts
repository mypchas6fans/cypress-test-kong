/// <reference types="cypress" />

// Reusable API helpers for creating/deleting services and routes

declare global {
  namespace Cypress {
    interface Chainable {
      apiCreateService(payload: any): Chainable<string>;
      apiDeleteService(id: string): Chainable<Cypress.Response<any> | null>;
      apiDeleteRoute(id: string): Chainable<Cypress.Response<any> | null>;
    }
  }
}

Cypress.Commands.add('apiCreateService', (payload: any) => {
  const url = Cypress.env('apiBaseUrl') + '/default/services';
  return cy.request({ method: 'POST', url, body: payload, headers: { Accept: 'application/json' }, failOnStatusCode: false })
    .then((resp) => {
      if (resp.status === 201) {
        return resp.body.id;
      }
      // Try to find an existing service with the same name
      return cy.request('GET', url).then((listResp) => {
        const items = listResp.body.data || listResp.body || [];
        const found = (items || []).find((s: any) => s && s.name === payload.name);
        if (found) return found.id;
        throw new Error('Could not create or find service ' + payload.name);
      });
    });
});

Cypress.Commands.add('apiDeleteService', (id: string) => {
  const url = Cypress.env('apiBaseUrl') + '/default/services/' + id;
  return cy.request({ method: 'DELETE', url, failOnStatusCode: false }).then(() => null);
});

Cypress.Commands.add('apiDeleteRoute', (id: string) => {
  const url = Cypress.env('apiBaseUrl') + '/default/routes/' + id;
  return cy.request({ method: 'DELETE', url, failOnStatusCode: false }).then(() => null);
});

export {};
