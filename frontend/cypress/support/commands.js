// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.visit(`http://localhost:5173/signin`);
    cy.get('input[name=username]').type('test');
    cy.get('input[name=password').type('123');
    cy.contains('button', 'Sign In').click();
    cy.url().should('include','http://localhost:5173/');
})


Cypress.Commands.add('checkNotVisible', (selector) => {
    cy.get('body').then((body) => {
      if (body.find(selector).length > 0) {
        cy.get(selector).should('not.be.visible');
      }
    });
  });