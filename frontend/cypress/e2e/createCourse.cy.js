Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test if the error message includes 'TypeError: can't access property'
  return false
})





describe('Create Course Route', () => {
  beforeEach(() => {
    cy.setToken(); // intercepts URL
    cy.login('test', '123');
    cy.wait('@validateJWTToken')
    cy.get('.css-1t6c9ts > :nth-child(3)').should('be.visible');
    cy.get('.css-1t6c9ts > :nth-child(3)').click();
});

  it('Unathenticated user is redirected to sigin route', () => {
    cy.visit(`${Cypress.env('FRONTEND_API_URL')}course/create`)
    cy.url().should('include', '/signin')
  })



  /* ==== Test Created with Cypress Studio ==== */
  it('Test Course\'s Title Textarea', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').click().type('Testing my Course Title Textarea');
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('be.visible');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', 'Testing my Course Title Textarea');
    /* ==== End Cypress Studio ==== */
  });


  /* ==== Test Created with Cypress Studio ==== */
  it('Test Course\'s Description Textarea', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiGrid-grid-xs-12 > .MuiGrid-container > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('be.visible');
    /* ==== End Cypress Studio ==== */

    cy.get('[data-cy="Course Description"]').type(`What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.......`)


    /* ==== Generated with Cypress Studio ==== */

    cy.get('[data-cy="Course Description"] > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should(
      'have.value',
      'What is Lorem Ipsum?\n    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.......'
    );

    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Test Course\'s Card', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiGrid-spacing-xs-4 > :nth-child(1) > .MuiButtonBase-root').should('be.visible');
    cy.get('.MuiGrid-spacing-xs-4 > :nth-child(1) > .MuiButtonBase-root').click();
    cy.get('.course-thumbnail').should('have.class', 'course-thumbnail');
    cy.get('.course-thumbnail').should('be.visible');
    cy.get('#formatted-numberformat-input').should('be.visible');
    cy.get('#formatted-numberformat-input').clear('$6');
    cy.get('#formatted-numberformat-input').type('$69');
    cy.get('#formatted-numberformat-input').should('have.value', '$69');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#demo-simple-select').should('be.visible');

    cy.get('#outlined-number').clear('6');
    cy.get('#outlined-number').type('12');
    cy.get('#outlined-number').should('be.visible');
    cy.get('#outlined-number').should('have.value', '12');
    /* ==== End Cypress Studio ==== */

    cy.get('[data-cy="Select Difficulty"]').click();
    cy.contains('Beginner').click()

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#demo-simple-select').should('have.text', 'Beginner');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Test Course\'s Overview Textarea', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-f4w4gy-MuiGrid-root > :nth-child(1) > .MuiTypography-root').should('be.visible');
    /* ==== End Cypress Studio ==== */

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Course Overview"] > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('be.visible');
    /* ==== End Cypress Studio ==== */


    cy.get('[data-cy="Course Overview"]').type(`Why do we use it?
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`)

    /* ==== Generated with Cypress Studio ==== */

    cy.get('[data-cy="Course Overview"] > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should(
      'have.value',
      'Why do we use it?\n    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.'
    );

    /* ==== End Cypress Studio ==== */
  });


  /* ==== Test Created with Cypress Studio ==== */
  it('Test Preview this Course \'s textarea input', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(3) > .MuiTypography-h4').should('be.visible');
    cy.get('#lecture-url').clear('https://www.youtube.com/watch?v=jfKfPfyJRdk');
    cy.get('#lecture-url').type('https://www.youtube.com/watch?v=jfKfPfyJRdk');
    cy.get('#lecture-url').should('have.value', 'https://www.youtube.com/watch?v=jfKfPfyJRdk');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Test Course Content \'s Accordions', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-1yjvs5a > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').should('be.visible');
    cy.get('.css-1yjvs5a > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root > [data-testid="AddIcon"]').should('be.visible');
    cy.get('.css-1yjvs5a > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root > [data-testid="AddIcon"] > path').click();
    cy.get('[style="min-height: 0px; height: auto; transition-duration: 300ms;"] > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-content > .MuiTypography-root').should('have.text', 'Add an accordion, e.g., Phase 1');
    /* ==== End Cypress Studio ==== */

    cy.get('[data-cy="Add Accordion Input"]').type('Testing Inputs for Accordion / Section Heading');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-1yjvs5a > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-content > .MuiTypography-root').should('be.visible');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-expandIconWrapper > .MuiBox-root > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"] > path').click();
    cy.get('#standard-multiline-flexible').should('have.id', 'standard-multiline-flexible');
    /* ==== End Cypress Studio ==== */

    cy.get('#standard-multiline-flexible').clear();
    cy.get('#standard-multiline-flexible').type('Testing change of Accordion heading here');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiAccordionSummary-content > .MuiButtonBase-root').should('be.visible');
    cy.get('.MuiAccordionSummary-content > .MuiButtonBase-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-content > .MuiTypography-root').should('have.text', 'Testing change of Accordion heading here');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-expandIconWrapper > .MuiBox-root > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"] > path').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-expandIconWrapper > .MuiBox-root > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"]').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-expandIconWrapper > .MuiBox-root > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"] > path').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-expandIconWrapper > .MuiBox-root > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"] > path').click();
    cy.get('.MuiCollapse-entered > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-expandIconWrapper > .MuiBox-root > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"] > path').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#outlined-textarea').click().type('Just testing some accordions here');
    cy.get('[data-cy="Add Accordion Button"]').click();
    cy.get('.MuiAccordionSummary-content').click();
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').should('be.visible');
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root > [data-testid="AddIcon"]').should('be.visible');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root').should('have.text', 'Add an item, e.g., week 1-4: workout routine.Add Accordion Detail / Section Item');
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').should('have.value', 'Add an item, e.g., week 1-4: workout routine.');
    cy.get('[data-cy="Add Accordion Item"]').should('be.visible');
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').type('Testing, Adding Accordion Item');
    cy.get('[data-cy="Add Accordion Item"]').click();
    /* ==== End Cypress Studio ==== */


    // TODO
    // ADD MORE E2E TEST CASES
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiTypography-root').should('have.text', 'Add an item, e.g., week 1-4: workout routine.Testing, Adding Accordion Item');
    cy.get(':nth-child(1) > .MuiGrid-container > .MuiGrid-grid-xs-2 > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"] > path').click();
    /* ==== End Cypress Studio ==== */
  });
})