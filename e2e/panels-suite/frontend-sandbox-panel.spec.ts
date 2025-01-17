import panelSandboxDashboard from '../dashboards/PanelSandboxDashboard.json';
import { e2e } from '../utils';

const DASHBOARD_ID = 'c46b2460-16b7-42a5-82d1-b07fbf431950';

describe('Panel sandbox', () => {
  beforeEach(() => {
    e2e.flows.login(e2e.env('USERNAME'), e2e.env('PASSWORD'), true);
    return e2e.flows.importDashboard(panelSandboxDashboard, 1000, true);
  });

  describe('Sandbox disabled', () => {
    beforeEach(() => {
      e2e.flows.openDashboard({
        uid: DASHBOARD_ID,
        queryParams: {
          '__feature.pluginsFrontendSandbox': false,
        },
      });
    });

    it('Add iframes to body', () => {
      // this button adds iframes to the body
      cy.get('[data-testid="button-create-iframes"]').click();

      const iframeIds = [
        'createElementIframe',
        'innerHTMLIframe',
        'appendIframe',
        'prependIframe',
        'afterIframe',
        'beforeIframe',
        'outerHTMLIframe',
        'parseFromStringIframe',
        'insertBeforeIframe',
        'replaceChildIframe',
      ];
      iframeIds.forEach((id) => {
        cy.get(`#${id}`).should('exist');
      });
    });

    it('Reaches out of panel div', () => {
      // this button reaches out of the panel div and modifies the element dataset
      cy.get('[data-testid="button-reach-out"]').click();

      cy.get('[data-sandbox-test="true"]').should('exist');
    });
  });

  describe('Sandbox enabled', () => {
    beforeEach(() => {
      e2e.flows.openDashboard({
        uid: DASHBOARD_ID,
        queryParams: {
          '__feature.pluginsFrontendSandbox': true,
        },
      });
      cy.window().then((win) => {
        win.localStorage.setItem('grafana.featureToggles', 'pluginsFrontendSandbox=1');
      });
    });

    it('Does not add iframes to body', () => {
      // this button adds 3 iframes to the body
      cy.get('[data-testid="button-create-iframes"]').click();

      const iframeIds = [
        'createElementIframe',
        'innerHTMLIframe',
        'appendIframe',
        'prependIframe',
        'afterIframe',
        'beforeIframe',
        'outerHTMLIframe',
        'parseFromStringIframe',
        'insertBeforeIframe',
        'replaceChildIframe',
      ];
      iframeIds.forEach((id) => {
        cy.get(`#${id}`).should('not.exist');
      });
    });

    it('Does not reaches out of panel div', () => {
      // this button reaches out of the panel div and modifies the element dataset
      cy.get('[data-testid="button-reach-out"]').click();

      cy.get('[data-sandbox-test="true"]').should('not.exist');
    });
  });

  afterEach(() => {
    e2e.flows.revertAllChanges();
  });

  after(() => {
    return cy.clearCookies();
  });
});
