import Chance from "chance";
const chance = new Chance();

describe('User Signs In', () => {
    const username = chance.first();
    const password = '123'

    beforeEach(() => {
        cy.visit(`http://localhost:5173/signin`);
    });

    it('has a title', () => {
        cy.contains('Sign in');
    });

    it('has a link to Sign Up', ()=> {
        cy.contains("Don't have an account? Sign Up");
    }) ;

    it('should be able to input and submits with invalid credentials', () => {
    // get me the username form and type the random username
    cy.get('input[name=username]').type(username);

    // get me the password form and type the password
    cy.get('input[name=password]').type(password);

    // when sign in button is clicked
    cy.contains('button', 'Sign In').click();

    // then assert
    cy.contains('p', 'Invalid Username and Password').should('be.visible')

    });

    it('should be able to input and submits with valid credentials', ()=> {

        // get the username form and type 'test'
        cy.get('input[name=username]').type('test');

        // get the password form and type '123'
        cy.get('input[name=password]').type('123');

        // when sign in button is clicked
        cy.contains('button', 'Sign In').click();

        // then assert
        cy.url().should('include', '/home');

    });

    it('can click the SignUp link, which redirects them.', () => {
        cy.contains("Don't have an account? Sign Up").click();

        cy.url().should('include', '/signup');
    })
 
})