/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add('addIngredient', (type: string) => {
    const tabText = {
        'Булки': 'Булки',
        'Начинки': 'Начинки',
        'Соусы': 'Соусы'
    };

    const text = tabText[type];
    if (!text) {
        throw new Error(`Неизвестный тип ингредиента: ${type}`);
    }

    cy.contains('span', text).click({ force: true });

    cy.get('[data-cy="ingredient-item"]', { timeout: 10000 })
        .should('have.length.gt', 0)
        .first()
        .within(() => {
            cy.get('button').click({ force: true });
        });
});
