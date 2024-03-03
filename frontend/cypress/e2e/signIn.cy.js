import Chance from "chance";
const chance = new Chance();

describe('User Signs In', () => {
    const username = chance.first();
    const password = '123'

    beforeEach(() => {
        cy.visit(`http://localhost:5173/signin`);
    })

    it('has a title', () => {
        cy.contains('Sign in');
    })

    it('User can input and submits with invalid credentials', () => {
    // get me the input form for username and type the random username
    cy.get('input[name=username]').type(username);

    // get me the input form for password and type the password
    cy.get('input[name=password]').type(password);

    cy.contains('button', 'Sign In').click();

    cy.contains('p', 'Invalid Username and Password').should('be.visible')

    })

    it('User can input and submits with valid credentials', ()=> {
        
    })
 
})