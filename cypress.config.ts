import { defineConfig } from 'cypress'

// @ts-ignore: plugin doesn't export types for the '/plugin' subpath
// see: https://github.com/LironEr/cypress-mochawesome-reporter/issues/ (no subpath typings)
// Using @ts-ignore avoids needing a manual ambient declaration file.
// @ts-ignore
import mochawesomeReporter from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
    // E2E test core configuration
    e2e: {
        baseUrl: 'http://localhost:8002', // web service url
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // test file matching pattern
        supportFile: 'cypress/support/e2e.ts', // global support file
        // Test run options
        video: true,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 60000,

        // Reporter configuration
        setupNodeEvents(on, config) {
            mochawesomeReporter(on);
            return config;
        },

        reporter: 'cypress-mochawesome-reporter',
        reporterOptions: {
            reportDir: 'cypress/reports',
            overwrite: false,
            html: true,
            json: true,
            charts: true,
            embeddedScreenshots: true,
            inlineAssets: true,
            reportTitle: 'Kong Gateway UI test report',
            reportPageTitle: 'Kong Gateway UI test report',
            showPassed: true,
            showFailed: true,
            showSkipped: true,
            showDuration: true,
        },

        // Cypress port
        port: 2020,
        // test environment variables
        env: {
            workspace: 'default',
            apiBaseUrl: 'http://localhost:8001'
        }
    }
})