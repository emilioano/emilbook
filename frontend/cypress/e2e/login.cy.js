/// <reference types="cypress" />

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('visar login-formuläret som standard', () => {
    cy.get('h2').should('contain', 'Login to continue!');
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#email').should('not.exist');
    cy.get('.submit-button').should('contain', 'Login!');
  });

  it('visar felmeddelande vid felaktiga uppgifter', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { detail: 'Invalid credentials' },
    }).as('loginFail');

    cy.get('#username').type('wronguser');
    cy.get('#password').type('wrongpass');
    cy.get('.submit-button').click();

    cy.wait('@loginFail');
    cy.get('.error-message').should('contain', 'Invalid username or password!');
  });

  it('loggar in och omdirigerar till / vid giltiga uppgifter', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { user_id: 1, username: 'Anna_Testanvändare' },
    }).as('loginSuccess');

    cy.get('#username').type('Anna_Testanvändare');
    cy.get('#password').type('!12345');
    cy.get('.submit-button').click();

    cy.wait('@loginSuccess');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });

  it('stänger modalen och navigerar till / vid klick utanför', () => {
    cy.get('.login-wrapper').click('bottomLeft');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });

  it('stänger inte modalen vid klick inuti', () => {
    cy.get('.login-container').click();
    cy.url().should('include', '/login');
    cy.get('h2').should('contain', 'Login to continue!');
  });
});

describe('Registrering', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.contains('No account? Register').click();
  });

  it('växlar till registreringsformuläret', () => {
    cy.get('h2').should('contain', 'Create account');
    cy.get('#email').should('be.visible');
    cy.get('.submit-button').should('contain', 'Register');
  });

  it('registrerar konto och växlar tillbaka till login', () => {
    cy.intercept('POST', '**/users/', {
      statusCode: 201,
      body: {},
    }).as('registerSuccess');

    cy.get('#username').type('newuser');
    cy.get('#email').type('new@example.com');
    cy.get('#password').type('securePass123');
    cy.get('.submit-button').click();

    cy.wait('@registerSuccess');
    cy.get('.success-message').should('contain', 'Account created! You can now login.');
    cy.get('h2').should('contain', 'Login to continue!');
  });

  it('visar fel om användarnamnet redan finns', () => {
    cy.intercept('POST', '**/users/', {
      statusCode: 400,
      body: { detail: 'User already exists!' },
    }).as('registerDuplicate');

    cy.get('#username').type('existinguser');
    cy.get('#password').type('somepass123');
    cy.get('.submit-button').click();

    cy.wait('@registerDuplicate');
    cy.get('.error-message').should('contain', 'User with this username already exists!');
  });

  it('visar generiskt fel vid oväntat serverfel', () => {
    cy.intercept('POST', '**/users/', {
      statusCode: 500,
      body: {},
    }).as('registerError');

    cy.get('#username').type('newuser');
    cy.get('#password').type('somepass123');
    cy.get('.submit-button').click();

    cy.wait('@registerError');
    cy.get('.error-message').should('contain', 'Registration failed!');
  });

  it('rensar felmeddelanden vid toggle mellan login/register', () => {
    cy.intercept('POST', '**/users/', {
      statusCode: 500,
      body: {},
    }).as('registerError');

    cy.get('#username').type('fail');
    cy.get('#password').type('fail');
    cy.get('.submit-button').click();
    cy.wait('@registerError');
    cy.get('.error-message').should('be.visible');

    cy.contains('Already have an account? Login').click();
    cy.get('.error-message').should('not.exist');
    cy.get('.success-message').should('not.exist');
  });

  it('tillåter registrering utan e-post', () => {
    cy.intercept('POST', '**/users/', (req) => {
      expect(req.body.email).to.be.undefined;
      req.reply({ statusCode: 201, body: {} });
    }).as('registerNoEmail');

    cy.get('#username').type('noemailuser');
    cy.get('#password').type('securePass123');
    cy.get('.submit-button').click();

    cy.wait('@registerNoEmail');
    cy.get('.success-message').should('be.visible');
  });
});