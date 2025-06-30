describe('Burger Constructor', () => {
    beforeEach(() => {
        cy.setCookie('accessToken', 'Bearer test-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', '**/api/orders', {
            statusCode: 200,
            body: {
                success: true,
                name: 'Флюоресцентный space бургер',
                order: { number: 123456 }
            }
        }).as('createOrder');

        window.localStorage.setItem(
            'refreshToken',
            JSON.stringify('test-refresh-token')
        );
        window.localStorage.setItem(
            'accessToken',
            JSON.stringify('test-access-token')
        );

        cy.visit('/');
        cy.wait('@getIngredients');
        cy.get('[data-cy="constructor"]').should('be.visible');
    });

    afterEach(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    it('должен загрузить ингредиенты', () => {
        cy.get('[data-cy="ingredient-item"]').should('have.length.greaterThan', 0);
    });

    it('должен добавить булку в конструктор', () => {
        cy.get('[data-cy="ingredient-item"]').first()
            .parent()
            .find('button')
            .click({ force: true });

        cy.get('[data-cy="constructor"]')
            .children()
            .should('have.length.greaterThan', 0);
    });

    it('должен создать заказ', () => {
        cy.window().then((win) => {
            const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
            if (overlay) overlay.remove();
        });
        cy.get('[data-cy="ingredient-item"]').first()
            .parent()
            .find('button')
            .click({ force: true });

        cy.contains('button', 'Оформить заказ')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        cy.wait('@createOrder').then((interception) => {
            expect(interception.response?.body.success).to.be.true;
            expect(interception.response?.body.order.number).to.equal(123456);
        });

        cy.get('[data-cy="modal"]', { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .then(($modal) => {
                expect($modal).to.be.visible;

                const orderNumber = $modal.find('[data-cy="order-number"]');
                if (orderNumber.length > 0) {
                    expect(orderNumber.text()).to.contain('123456');
                } else {
                    const altSelector = $modal.find('.text_type_digits-large');
                    if (altSelector.length > 0) {
                        expect(altSelector.text()).to.contain('123456');
                    } else {
                        throw new Error('Не удалось найти номер заказа в модальном окне');
                    }
                }
            });

        cy.get('[data-cy="modal-overlay"]')
            .click('left', { force: true });

        cy.get('[data-cy="modal"]').should('not.exist');
    });
});
