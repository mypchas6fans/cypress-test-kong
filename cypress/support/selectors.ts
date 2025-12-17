// Centralized selectors for gateway service tests
export const selectors = {
  // Top page and sidebar
  workspaceLinkDefault: '[data-testid="workspace-link-default"]',
  sidebarToggle: 'a.sidebar-menu-toggle',
  sidebarGatewayServices: '[data-testid="sidebar-item-gateway-services"]',
  sidebarRoutes: '[data-testid="sidebar-item-routes"]',

  // Buttons in main page, using href since elements differ when object exists or not
  addGatewayService: '[href="/default/services/create"]',
  addRoute: '[href="/default/routes/create"]',

  // Add gateway service form fields and buttons
  gatewayServiceUrlInput: '[data-testid="gateway-service-url-input"]',
  advancedFieldsCollapse: '[data-testid="advanced-fields-collapse"]',
  advancedCollapseTrigger: '[data-testid="collapse-trigger-content"]',
  gatewayServiceRetriesInput: '[data-testid="gateway-service-retries-input"]',
  gatewayServiceNameInput: '[data-testid="gateway-service-name-input"]',
  tagsCollapse: '[data-testid="tags-collapse"]',
  gatewayServiceTagsInput: '[data-testid="gateway-service-tags-input"]',
  serviceCreateFormSubmit: '[data-testid="service-create-form-submit"]',

  // Service detail page
  namePropertyValue: '[data-testid="name-property-value"]',
  servicesMetric: '[data-testid="Services"]',

  // Add route form fields and buttons
  routeNameInput: '[data-testid="route-form-name"]',
  routeServiceSelect: '[data-testid="route-form-service-id"]',
  routePathsInput: '[data-testid="route-form-paths-input-1"]',
  routeCreateFormSubmit: '[data-testid="route-create-form-submit"]',
}

export default selectors;