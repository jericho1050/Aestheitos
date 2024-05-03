Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test if the error message includes 'TypeError: can't access property'
  return false
})


it('Unathenticated user is redirected to sigin route', () => {
  cy.visit(`${Cypress.env('FRONTEND_API_URL')}course/create`)
  cy.url().should('include', '/signin')
})


describe('Create Course Route', () => {
  beforeEach(() => {
    cy.setToken(); // intercepts URL
    cy.login('test', '123');
    cy.wait('@validateJWTToken')
    cy.get('.css-1t6c9ts > :nth-child(3)').should('be.visible');
    cy.get('.css-1t6c9ts > :nth-child(3)').click();
});





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
    cy.get('input[type=file]').selectFile('src/static/images/what.jpg', {force: true})
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
    cy.get('[data-cy="nextButton"]').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-f4w4gy-MuiGrid-root > :nth-child(1) > .MuiTypography-root').should('be.visible');
    /* ==== End Cypress Studio ==== */

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Course Overview"] > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('be.visible');
    /* ==== End Cypress Studio ==== */


    cy.get('#demo-helper-text-aligned-no-helper').type(`Why do we use it?
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`)

    /* ==== Generated with Cypress Studio ==== */

    cy.get('#demo-helper-text-aligned-no-helper').should(
      'have.value',
      'Why do we use it?\n    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.'
    );

  });


  /* ==== Test Created with Cypress Studio ==== */
  it('Test Preview this Course \'s textarea input', function() {
    cy.get('[data-cy="nextButton"]').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(3) > .MuiTypography-h4').should('be.visible');
    cy.get('#lecture-url').clear('https://www.youtube.com/watch?v=jfKfPfyJRdk');
    cy.get('#lecture-url').type('https://www.youtube.com/watch?v=jfKfPfyJRdk');
    cy.get('#lecture-url').should('have.value', 'https://www.youtube.com/watch?v=jfKfPfyJRdk');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Test Course Content \'s Accordions', function() {
    for (let i = 0; i < 2; i++) {
      cy.get('[data-cy="nextButton"]').click();

    }
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
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Accordion item 5"]').click( {force: true});
    cy.get('.MuiDialogContent-root').should('be.visible');
    cy.get('.MuiCardContent-root').should('be.visible');
    cy.get('.MuiButtonGroup-root > .MuiButton-contained').should('be.enabled');
    cy.get('.MuiButtonGroup-root > .MuiButton-outlined').should('be.enabled');
    cy.get('.css-9flz1g-MuiGrid-root > :nth-child(2) > .MuiButtonBase-root > [data-testid="AddIcon"] > path').should('be.visible');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    cy.get('.MuiDialogContent-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get('.MuiCardContent-root').should('be.visible');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    // cy.get('.MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', 'Testing Workout Description\n\n\nDO:\n\n3 X 5 OKAY');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Testing accordion item\'s responsive dialog (Workout Routine & Video Lecture section)', function() {
    for (let i = 0; i < 2; i++) {
      cy.get('[data-cy="nextButton"]').click();

    }
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiAccordionSummary-content > .MuiTypography-root').click();
    cy.get('[data-cy="Accordion item 0"]').click();
    cy.get('.MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').should('be.enabled');
    // cy.get('.MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    cy.get('[data-cy="Add icon"]')
    cy.get('.MuiDialogContent-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > [data-testid="AddIcon"] > path').should('be.visible');
    cy.get('.MuiButtonGroup-root > .MuiButton-outlined').should('be.enabled');
    cy.get('.MuiButtonGroup-root > .MuiButton-outlined').click();
    cy.get('.css-rje4ir-MuiGrid-root > .MuiTypography-root').should('have.text', 'Your readme text here');
    cy.get('.MuiDialogContent-root > .MuiGrid-container > .course-lecture-container > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').should('be.visible');
    cy.get('.MuiDialogContent-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiBox-root').should('be.visible');
    cy.get('.MuiDialogContent-root > .MuiGrid-container > .course-lecture-container > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').click();
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').clear();
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').type('https://www.youtube.com/watch?v=ZFBP4549A1s');
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').should('have.value', 'https://www.youtube.com/watch?v=ZFBP4549A1s');
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').clear();
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').type('https://www.youtube.com/watch?v=ZFBP4549A1s');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Accordion item 1"]').click({force: true});
    cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"] > path').click({force: true});
    cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"] > path').click({force: true});
    cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"]').click({force: true});
    // cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"] > path').click();
    // cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"]').click();
    // cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"]').click();
    // cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"]').click();
    cy.get('[data-cy="Workout Card"]').should('have.length', 4)
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    // cy.get(':nth-child(8) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    // cy.get(':nth-child(7) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    // cy.get(':nth-child(6) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    // cy.get(':nth-child(5) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(4) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(3) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(2) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    // cy.get('.MuiCardActions-root > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButtonBase-root').click();
    cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"] > path').click();
    cy.get('[data-cy="Add icon"] > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(1) > [data-cy="Workout Card"] > .MuiButton-outlinedPrimary').click();
    cy.get(':nth-child(1) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > :nth-child(1) > .MuiButtonBase-root').click();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root').should('be.visible');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', 'Correct exercise form description: e.g., Shoulder blades are depressed downwards');
    cy.get('.css-9flz1g-MuiGrid-root > :nth-child(2) > .MuiButtonBase-root > [data-testid="AddIcon"]').should('be.visible');
    cy.get('.css-9flz1g-MuiGrid-root > :nth-child(2) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(3) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(4) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(5) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get('[data-cy="Correct Form Workout Card"]').should('have.length', 5);
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(5) > .MuiPaper-root > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(4) > .MuiPaper-root > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(3) > .MuiPaper-root > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').clear();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').type('Testing Correct workout description')
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', 'Testing Correct workout description');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(6) > .MuiDialog-container > .MuiPaper-elevation24 > .MuiDialogActions-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(1) > [data-cy="Workout Card"] > .MuiCardActions-root > .MuiGrid-container > :nth-child(2) > .MuiButtonBase-root').click();
    cy.get('[data-cy="Wrong Form Workout Card"] > .MuiButton-outlined').should('be.visible');
    cy.get('[data-cy="Wrong Form Workout Card"] > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', 'Wrong exercise form description: e.g., Shoulder blades not retracting');
    cy.get('.css-9flz1g-MuiGrid-root > :nth-child(2) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(3) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(4) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(5) > .MuiButtonBase-root > [data-testid="AddIcon"]').click();
    cy.get('[data-cy="Wrong Form Workout Card"]').should('have.length', 5)
    cy.get(':nth-child(5) > [data-cy="Wrong Form Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(4) > [data-cy="Wrong Form Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-icon > [data-testid="DeleteIcon"] > path').click();
    cy.get(':nth-child(3) > [data-cy="Wrong Form Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(2) > [data-cy="Wrong Form Workout Card"] > .MuiCardActions-root > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Wrong Form Workout Card"] > .MuiCardMedia-root').should('have.attr', 'src', '/src/static/images/pushupVecs.gif');
    cy.get('[data-cy="Wrong Form Workout Card"] > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').clear();
    // cy.get('.css-11lq3yg-MuiGrid-root > .MuiDialogContent-root > .css-9flz1g-MuiGrid-root > :nth-child(1)').click();
    cy.get('[data-cy="Wrong Form Workout Card"] > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').type('Testing Wrong exercise form description here');
    cy.get('[data-cy="Wrong Form Workout Card"] > .MuiCardContent-root > .MuiBox-root > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', 'Testing Wrong exercise form description here');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    // cy.get(':nth-child(6) > .MuiDialog-container > .MuiPaper-elevation24 > .MuiDialogActions-root > .MuiButtonBase-root').click();
    // cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
    // cy.get('[data-cy="Add Accordion Input"] > .MuiInputBase-root > #outlined-textarea').click();
    // cy.get('[data-cy="Add Accordion Button"] > [data-testid="AddIcon"]').click();
    // cy.get('[style="min-height: 0px; height: auto; transition-duration: 300ms;"] > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-content').click();
    // cy.get('.css-1bvc4cc > .MuiButtonBase-root').should('be.enabled');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Test Create Course overall', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').click().type('Testing Course title so nothing here');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Course Description"] > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').click().type('Testing Workout Description just a quick typing here because idk nothing i could thikn of words ehre just writing what is on my mind');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiGrid-spacing-xs-4 > :nth-child(1) > .MuiButtonBase-root').should('have.text', 'Upload Image');
    cy.get('input[type=file]').selectFile('src/static/images/what.jpg', {force: true})
    cy.get('.course-thumbnail').should('have.class', 'course-thumbnail');
    /* ==== End Cypress Studio ==== */

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#formatted-numberformat-input').clear('$123');
    cy.get('#formatted-numberformat-input').type('$123');
    cy.get('[data-cy="Select Difficulty"]').click();
    cy.contains('Advanced').click()
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#outlined-number').clear('1');
    cy.get('#outlined-number').type('14');
    cy.get('#formatted-numberformat-input').should('have.value', '$123');
    cy.get('#demo-simple-select').should('have.text', 'Advanced');
    cy.get('#outlined-number').should('have.value', '14');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="nextButton"]').click();

    cy.get('#demo-helper-text-aligned-no-helper').click().type('Testing Course Oveview. meaning this Course overview is just a test case that is part of my e2e testing that all im writing here is nothing but tet that is been on my mind.');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#demo-helper-text-aligned-no-helper').should('have.value', 'Testing Course Oveview. meaning this Course overview is just a test case that is part of my e2e testing that all im writing here is nothing but tet that is been on my mind.');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#lecture-url').click();
    cy.get('#lecture-url').clear('https://www.youtube.com/watch?v=7N63cMKosIE&t=373s');
    cy.get('#lecture-url').type('https://www.youtube.com/watch?v=7N63cMKosIE&t=373s');


    cy.get('[data-cy="nextButton"]').click();
    cy.get('[data-cy="Add Accordion Input"] > .MuiInputBase-root > #outlined-textarea').click();
    cy.get('.MuiAccordionSummary-content > .MuiTypography-root').click();
    cy.get('.MuiAccordionSummary-content > .MuiTypography-root').click();
    cy.get('.MuiBox-root > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"] > path').click();
    cy.get('.css-f4w4gy-MuiGrid-root').click();
    cy.get('#standard-multiline-flexible').clear();
    cy.get('#standard-multiline-flexible').type('Required Equipments');
    cy.get('.MuiAccordionSummary-content > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').click();
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').click().type('Required Equipments');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#panel1bh-header').click();
    cy.get('.MuiAccordionSummary-content > .MuiTypography-root').click();
    cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-grid-xs-2 > :nth-child(2) > .MuiButton-icon > [data-testid="DeleteIcon"]').click( {force: true});
    // cy.get('.MuiAccordionDetails-root > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
    // cy.get('[data-cy="Accordion item edit-0"]').click().clear();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiBox-root > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"] > path').click();
    cy.get('#standard-multiline-flexible').click();
    cy.get('[data-cy="Accordion edit-0"] > .MuiInputBase-root').click().clear();
    cy.get('[data-cy="Accordion edit-0"] > .MuiInputBase-root').click().type('Must have Equipments');

    cy.get('.MuiAccordionSummary-content > .MuiButtonBase-root').click();
    cy.get('.MuiAccordionSummary-content > .MuiTypography-root').should('have.text', 'Must have Equipments');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiBox-root > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"]').click();
    cy.get('[data-cy="Accordion edit-0"] > .MuiInputBase-root').click().clear();
    cy.get('[data-cy="Accordion edit-0"] > .MuiInputBase-root').click().type('Introduction / Preparations');
    cy.get('.MuiAccordionSummary-content > .MuiButtonBase-root').click();

    cy.get('.MuiGrid-grid-xs-2 > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"]').click();
    cy.get('[data-cy="Accordion item edit-0').clear();
    cy.get('[data-cy="Accordion item edit-0').type('Required equipments');

    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiAccordionSummary-content > .MuiTypography-root').should('have.text', 'Introduction / Preparations');
    cy.get('.MuiAccordionDetails-root > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root').click();
    cy.get('[data-cy="Accordion item 0"]').should('have.text', 'Required equipments');
    cy.get('[data-cy="Accordion item 0"]').click();
    cy.get('.MuiButtonGroup-root > .MuiButton-outlined').click();
    cy.get('.MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').click();
    cy.get('[data-cy="lecture textfield"]').type(`Testing textfield
    Your equipment needed:

        - rings
        - pull up bar
        - dip bar
    `)
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="lecture textfield"] > .MuiInputBase-root > #demo-helper-text-aligned-no-helper').should('have.value', ' Your Description here: Lorem ipsum dolor sit amet, Aenean commodo ligula eget dolor.Testing textfield\n    Your equipment needed:\n\n        - rings\n        - pull up bar\n        - dip bar\n    ');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').clear();
    cy.get('.css-15v22id-MuiAccordionDetails-root > .MuiBox-root > .MuiGrid-container > .MuiGrid-grid-xs-10 > .MuiFormControl-root > .MuiInputBase-root > #outlined-textarea').click().type('What you need to know');
    cy.get('[data-cy="Add Accordion Item"] > [data-testid="AddIcon"]').click();
    cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-grid-xs-2 > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"]').click();
    cy.get('[data-cy="Accordion item edit-2"]').clear();
    cy.get('[data-cy="Accordion item edit-2"]').type('Fitness terms you need to know');

    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root').click();
    cy.get('[data-cy="Accordion item 2"]').should('have.text', 'Fitness terms you need to know');
    cy.get('[data-cy="Accordion item 2"]').click();
    cy.get('.MuiButtonGroup-root > .MuiButton-outlined').click();
    cy.get('.MuiDialogContent-root > .MuiGrid-container > .course-lecture-container > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').click();
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').clear();
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('.css-1nrqm0y > .MuiFormControl-root > .MuiInputBase-root > #lecture-url').should('have.value', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="Add Accordion Input"] > .MuiInputBase-root > #outlined-textarea').clear();
    cy.get('[data-cy="Add Accordion Input"] > .MuiInputBase-root > #outlined-textarea').click().type('Phase 1: week 1-2');
    cy.get('[data-cy="Add Accordion Button"] > [data-testid="AddIcon"]').click();
    cy.get('[style="min-height: 0px; height: auto; transition-duration: 300ms;"] > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-content > .MuiTypography-root').should('have.text', 'Phase 1: week 1-2');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[style="min-height: 0px; height: auto; transition-duration: 300ms;"] > :nth-child(1) > :nth-child(1) > .MuiPaper-root > #panel1bh-header > .MuiAccordionSummary-content').click();
    cy.get('[style="min-height: 0px; height: auto; transition-duration: 300ms;"] > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > #panel1bh-content > ul > .MuiAccordionDetails-root > .MuiGrid-container > .MuiGrid-grid-xs-2 > :nth-child(1) > .MuiButton-icon > [data-testid="EditIcon"] > path').click();
    cy.get('[data-cy="Accordion item edit-3"]').clear();
    cy.get('[data-cy="Accordion item edit-3"]').type('Explanation');
    

    /* ==== End Cypress Studio ==== */
  });
})