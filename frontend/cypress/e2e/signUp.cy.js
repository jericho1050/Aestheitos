import Chance from "chance";
const chance = new Chance();

describe("User Signs up ", () => {
    const firstName = chance.first();
    const lastName = chance.last();
    const username = chance.string();
    const password = chance.string();
    beforeEach(() => {
        cy.visit(`http://localhost:5173/signup`);
    });

    it('has a title', () => {
        cy.contains('Sign Up');
    });

    it('has 5 input form', () => {
        cy.get('input').should('have.length', 5);
    })

    it("has a link to sign in and redirects user to Sign in route", () => {
        cy.contains('Already have an account? Sign in');
        cy.contains('a', 'Already have an account?').click()
        cy.url().should('include', "/");
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('inputs all required fields, then sends a request to server with username taken.', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#firstName').clear('te');
        cy.get('#firstName').type('test');
        cy.get('#lastName').clear('te');
        cy.get('#lastName').type('test');
        cy.get('#username').clear('te');
        cy.get('#username').type('test123');
        cy.get('#email').clear('te');
        cy.get('#email').type('test@gmail.com');
        cy.get('#password').clear('123');
        cy.get('#password').type('123');
        cy.get('.MuiButtonBase-root').click();
        /* ==== End Cypress Studio ==== */
    });

    it('inputs all required fields, then sends a request to server with valid credentials', () => {

        // intercept the XHR to our backend server
        Cypress.env()
        cy.intercept('POST', `${Cypress.env('REST_API_URL')}/register`, {
            statusCode: 200,
            body: { "access": Cypress.env('ACCESS_TOKEN_TEST'), "refresh": Cypress.env('REFRESH_TOKEN_TEST')}

        }).as('postRegister');
        console.log(Cypress.env('REST_API_URL'));
        console.log(Cypress.env('ACCESS_TOKEN_TEST'));
        console.log(Cypress.env('REFRESH_TOKEN_TEST'));
        cy.get('input[name=firstName]').type(firstName);
        cy.get('input[name=lastName').type(lastName);
        cy.get('input[name=username').type(username);
        cy.get('input[name=password').type(password);
        cy.get('button').click();

        cy.wait('@postRegister').should(({ request, response }) => {
            
            expect(request.body).to.have.property('first_name')
            expect(request.body).to.have.property('last_name')
            expect(request.body).to.have.property('username')
            expect(request.body).to.have.property('email')
            expect(request.body).to.have.property('password')
            expect(request.headers).to.have.property('content-type');
            expect(response.body).to.have.property('access')
            expect(response.body).to.have.property('refresh')
            
        });
        cy.url().should('include', "/home")
    })
});