/// <reference types="cypress" />
const targetPageLoadTimeMs = 3000; // target page load time threshold

describe('Kong gateway UI test/frontend performance', () => {

    it('Service page web vitals statistic', () => {
        cy.visit('/default/services', {
            onBeforeLoad: (win) => {
                // initialize performance marks
                win.performance.mark('pageLoadStart');
            },
            onLoad: (win) => {
                // Mark the end of page load and measure
                win.performance.mark('pageLoadEnd');
                win.performance.measure('pageLoad', 'pageLoadStart', 'pageLoadEnd');

                const pageLoadTime = win.performance.getEntriesByName('pageLoad')[0]?.duration;

                // Collect web vitals metrics FCP and LCP
                const fcp = win.performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime;
                const lcp = win.performance.getEntriesByType('largest-contentful-paint')[0]?.startTime;

                // Store metrics on window for Cypress to read after visit
                (win as any).__metrics = { pageLoadTime, fcp, lcp };
            },
        });

        // Read metrics and assert using Cypress commands (safe)
        cy.window().its('__metrics').then((metrics: any) => {
            cy.log(`services FCP:${metrics.fcp}ms`);
            cy.log(`services LCP:${metrics.lcp}ms`);
            cy.log(`services Page Load Time:${metrics.pageLoadTime}ms`);
            expect(metrics.pageLoadTime).to.be.lessThan(targetPageLoadTimeMs);
        });
    });

    it('Route page web vitals statistic', () => {
        cy.visit('/default/routes', {
            onBeforeLoad: (win) => {
                // initialize performance marks
                win.performance.mark('pageLoadStart');
            },
            onLoad: (win) => {
                // Mark the end of page load and measure
                win.performance.mark('pageLoadEnd');
                win.performance.measure('pageLoad', 'pageLoadStart', 'pageLoadEnd');

                const pageLoadTime = win.performance.getEntriesByName('pageLoad')[0]?.duration;

                // Collect web vitals metrics FCP and LCP
                const fcp = win.performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime;
                const lcp = win.performance.getEntriesByType('largest-contentful-paint')[0]?.startTime;

                // Store metrics on window for Cypress to read after visit
                (win as any).__metrics = { pageLoadTime, fcp, lcp };
            },
        });

        // Read metrics and assert using Cypress commands (safe)
        cy.window().its('__metrics').then((metrics: any) => {
            cy.log(`routes FCP:${metrics.fcp}ms`);
            cy.log(`routes LCP:${metrics.lcp}ms`);
            cy.log(`routes Page Load Time:${metrics.pageLoadTime}ms`);
            expect(metrics.pageLoadTime).to.be.lessThan(targetPageLoadTimeMs);
        });
    });
})