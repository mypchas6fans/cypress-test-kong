// Centralized test data used by specs. This allows overriding via env vars (CYPRESS_serviceUrl, CYPRESS_serviceTag, CYPRESS_serviceDefaultReadTimeout)
import common from '@/fixtures/common.json';

export const SERVICE_URL: string = (Cypress.env('serviceUrl') as string) ?? (`http://${String(common.serviceDomainPath)}` as string);
export const SERVICE_TAG: string = (Cypress.env('serviceTag') as string) ?? (common.serviceTag as string);
export const SERVICE_DEFAULT_READ_TIMEOUT: number = Number(Cypress.env('serviceDefaultReadTimeout')) || (common.serviceDefaultReadTimeout as number);
export const SERVICE_CUSTOM_READ_TIMEOUT: number = Number(Cypress.env('serviceCustomReadTimeout')) || (common.serviceCustomReadTimeout as number);

/**
 * Generate representative service payload combinations based on common.json ranges and protocols.
 * Produces a small, deterministic set of payloads per protocol: default, custom, min, and max variants.
 */
export function generateServiceCombos(): Array<Record<string, any>> {
  const protocols = String(common.serviceProtocols || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const tagArray = String(common.serviceTagArray || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const timestamp = Date.now();

  const defaults = {
    connect_timeout: Number(common.serviceDefaultConnectTimeout),
    write_timeout: Number(common.serviceDefaultWriteTimeout),
    read_timeout: Number(common.serviceDefaultReadTimeout),
    retries: Number(common.serviceDefaultRetries),
  };

  const customs = {
    connect_timeout: Number(common.serviceCustomConnectTimeout),
    write_timeout: Number(common.serviceCustomWriteTimeout),
    read_timeout: Number(common.serviceCustomReadTimeout),
    retries: Number(common.serviceCustomRetries),
  };

  const mins = {
    connect_timeout: Number(common.serviceMinConnectTimeout),
    write_timeout: Number(common.serviceMinWriteTimeout),
    read_timeout: Number(common.serviceMinReadTimeout),
    retries: Number(common.serviceMinRetries),
  };

  const maxs = {
    connect_timeout: Number(common.serviceMaxConnectTimeout),
    write_timeout: Number(common.serviceMaxWriteTimeout),
    read_timeout: Number(common.serviceMaxReadTimeout),
    retries: Number(common.serviceMaxRetries),
  };

  const variants = [
    { name: 'default', values: defaults },
    { name: 'custom', values: customs },
    { name: 'min', values: mins },
    { name: 'max', values: maxs },
  ];

  const combos: Array<Record<string, any>> = [];
  protocols.forEach((protocol) => {
    variants.forEach((v) => {
      // Build a predictable payload that the Admin API should accept. Use the protocol as URL scheme.
      const payload: Record<string, any> = {
        name: `combo-${protocol}-${v.name}-${timestamp}`,
        tags: tagArray,
        retries: v.values.retries,
        connect_timeout: v.values.connect_timeout,
        read_timeout: v.values.read_timeout,
        write_timeout: v.values.write_timeout,
        enabled: true,
        // Use service domain path if present to create a valid URL
        url: `${protocol}://${String(common.serviceDomainPath)}`,
      };
      combos.push(payload);
    });
  });

  return combos;
}