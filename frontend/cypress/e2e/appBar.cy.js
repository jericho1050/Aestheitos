describe('Responsive Appbar State', ()=> {
    beforeEach(() => {
        cy.visit(`http://localhost:5173/home`);
    })

    it("has the header of the brand", () => {
        cy.contains('Aestheitos');
    })

    it("has the sign in link when an annonymous user", () => {
        cy.contains('a', 'Sign in').click();
        cy.url().should('include', 'http://localhost:5173/signin');
    })

    it("has the avatar once authenticated or signed in", () => {
        cy.login('test', '123');
        cy.get('[data-cy="Avatar"]').should('be.visible')
    })

    it("log out the authenticated user", () => {
        cy.login('test', '123');
        cy.get('[data-cy="Tool tip"]').click();
        cy.contains('Logout').click();
        cy.checkNotVisible('[data-cy="Avatar"]');
    })
    

})  