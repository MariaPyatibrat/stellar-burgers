describe('Конструктор бургеров', () => {
    // Основные селекторы
    const INGREDIENT_ITEM_SELECTOR = '[data-cy="ingredient-item"]';
    const MODAL_SELECTOR = '[data-cy="modal"]';
    const MODAL_CLOSE_SELECTOR = '[data-cy="modal-close"]';
    const MODAL_OVERLAY_SELECTOR = '[data-cy="modal-overlay"]';
    const CONSTRUCTOR_SELECTOR = '[data-cy="constructor"]';
    const ORDER_BUTTON_SELECTOR = 'button:contains("Оформить заказ")';
    const CONSTRUCTOR_BUN_SELECTOR = '[data-cy="constructor-bun"]';
    const CONSTRUCTOR_INGREDIENTS_SELECTOR = '[data-cy="constructor-ingredients"]';
    const ORDER_NUMBER_SELECTOR = '[data-cy="order-number"]';
    const TEXT_LARGE_SELECTOR = '.text_type_digits-large';

    // Текстовые константы
    const BUNS_SECTION_TEXT = 'Выберите булки';
    const FILLINGS_SECTION_TEXT = 'Выберите начинку';
    const FILLINGS_TAB_TEXT = 'Начинки';

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

        window.localStorage.setItem('refreshToken', JSON.stringify('test-refresh-token'));
        window.localStorage.setItem('accessToken', JSON.stringify('test-access-token'));

        cy.visit('/');
        cy.wait('@getIngredients');
        cy.get(CONSTRUCTOR_SELECTOR).should('be.visible');
    });

    afterEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    it('должен загрузить ингредиенты', () => {
        cy.get(INGREDIENT_ITEM_SELECTOR).should('have.length.greaterThan', 0);
    });

    it('должен добавить булку в конструктор', () => {
        cy.get(INGREDIENT_ITEM_SELECTOR).first()
            .parent()
            .find('button')
            .click({ force: true });

        cy.get(CONSTRUCTOR_SELECTOR)
            .children()
            .should('have.length.greaterThan', 0);
    });

    it('должен закрывать модальное окно по крестику', () => {
        cy.get(INGREDIENT_ITEM_SELECTOR).first().click();
        cy.get(MODAL_SELECTOR).should('be.visible');
        cy.get(MODAL_CLOSE_SELECTOR).click();
        cy.get(MODAL_SELECTOR).should('not.exist');
    });

    it('должен очищать конструктор после создания заказа', () => {
        cy.get(INGREDIENT_ITEM_SELECTOR).first()
            .parent()
            .find('button')
            .click({ force: true });

        cy.contains('span', FILLINGS_TAB_TEXT).click();
        cy.get(INGREDIENT_ITEM_SELECTOR).not(':contains("булка")').first()
            .parent()
            .find('button')
            .click({ force: true });

        cy.get(ORDER_BUTTON_SELECTOR)
            .should('be.visible')
            .click({ force: true });

        cy.wait('@createOrder', { timeout: 15000 });

        cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });

        cy.get(CONSTRUCTOR_BUN_SELECTOR).should('not.exist');
        cy.get(CONSTRUCTOR_INGREDIENTS_SELECTOR).should('not.exist');
        cy.contains(BUNS_SECTION_TEXT).should('exist');
        cy.contains(FILLINGS_SECTION_TEXT).should('exist');
    });

    it('должен создать заказ', () => {
        cy.window().then((win) => {
            const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
            if (overlay) overlay.remove();
        });

        cy.get(INGREDIENT_ITEM_SELECTOR).first()
            .parent()
            .find('button')
            .click({ force: true });

        cy.get(ORDER_BUTTON_SELECTOR)
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        cy.wait('@createOrder').then((interception) => {
            expect(interception.response?.body.success).to.be.true;
            expect(interception.response?.body.order.number).to.equal(123456);
        });

        cy.get(MODAL_SELECTOR, { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .then(($modal) => {
                expect($modal).to.be.visible;

                const orderNumber = $modal.find(ORDER_NUMBER_SELECTOR);
                if (orderNumber.length > 0) {
                    expect(orderNumber.text()).to.contain('123456');
                } else {
                    const altSelector = $modal.find(TEXT_LARGE_SELECTOR);
                    if (altSelector.length > 0) {
                        expect(altSelector.text()).to.contain('123456');
                    } else {
                        throw new Error('Не удалось найти номер заказа в модальном окне');
                    }
                }
            });

        cy.get(MODAL_OVERLAY_SELECTOR)
            .click('left', { force: true });

        cy.get(MODAL_SELECTOR).should('not.exist');
    });
});
