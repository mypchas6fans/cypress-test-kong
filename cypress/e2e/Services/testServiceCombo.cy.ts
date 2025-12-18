/// <reference types="cypress" />
import { generateServiceCombos } from '@/support/testData'

describe('Kong gateway test/service/combos', () => {
  it('creates services for representative payload combinations', () => {
    const combos = generateServiceCombos();

    // Create each payload and immediately clean up; run within Cypress command chain
    cy.wrap(combos).each((payload: any) => {
      cy.log('creating service payload: ' + payload.name);
      cy.apiCreateService(payload).then((id) => {
        expect(id).to.be.a('string').and.not.be.empty;
        // cleanup
        cy.apiDeleteService(String(id));
      });
    });
  });
});
