describe("Fitness Website For All - Sanity", () => {
  it("loads home and navigates", () => {
    cy.visit("/");
    cy.contains("Fitness Website For All");
    cy.contains("Browse Content").click();
    cy.url().should("include", "/content");
    cy.contains("Fitness Content");
    cy.get('a[href="/login"]').click();
    cy.url().should("include", "/login");
    cy.get("[data-cy=login-email]").should("exist");
    cy.get("[data-cy=login-password]").should("exist");
  });

  it("shows register page", () => {
    cy.visit("/register");
    cy.get("[data-cy=register-name]").should("exist");
    cy.get("[data-cy=register-email]").should("exist");
  });
});
