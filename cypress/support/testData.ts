// Centralized test data used by specs. This allows overriding via env vars (CYPRESS_serviceUrl, CYPRESS_serviceTag, CYPRESS_serviceDefaultReadTimeout)
import common from '@/fixtures/common.json';

export const SERVICE_URL: string = (Cypress.env('serviceUrl') as string) ?? (common.serviceUrl as string);
export const SERVICE_TAG: string = (Cypress.env('serviceTag') as string) ?? (common.serviceTag as string);
export const SERVICE_DEFAULT_READ_TIMEOUT: number = Number(Cypress.env('serviceDefaultReadTimeout')) || (common.serviceDefaultReadTimeout as number);
export const SERVICE_CUSTOM_READ_TIMEOUT: number = Number(Cypress.env('serviceCustomReadTimeout')) || (common.serviceCustomReadTimeout as number);