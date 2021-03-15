describe("Creating persona document", () => {
  let pageObj = {};
  let persona = {};
  beforeEach(() => {
    cy.fixture("page-obj.json").then(function (data) {
      pageObj = data;
    });
    cy.fixture("persona-data.json").then(function (data) {
      persona = data;
    });
    cy.visit("localhost:8000");
    cy.get("#username").type("tester@tester.com");
    cy.get("#password").type("somepassword");
    // alias response - using deprecated route() because there is a bug in cypress in intercept()
    cy.server().route("POST", "https://testableapp.com/auth/local").as("login");
    cy.get(".styled__StyledButton-kdcIry").click();
    // wait for post 200
    cy.wait("@login");
    cy.get("#intro-build-persona-button").click();
  });

  context("Creating document page tests", () => {
    it("fill out persona details and send PDF", () => {
      cy.get(pageObj.Persona_name).type(persona.Persona_name);
      cy.get(pageObj.Full_name).type(persona.Full_name);
      cy.get(pageObj.Occupation).type(persona.Occupation);
      cy.get(pageObj.Age).type(persona.Age);
      cy.get(pageObj.Sex).click();
      cy.get(pageObj.Sex_male).click();
      cy.get(pageObj.Location).type(persona.Location);
      cy.get(pageObj.Company_size).click();
      cy.get(pageObj.Company_size_50).click();
      cy.get(pageObj.Industry).type(persona.Industry);
      cy.get(pageObj.Education).click();
      cy.get(pageObj.Education_bachelor).click();
      cy.get(pageObj.Family_status).click();
      cy.get(pageObj.Family_status_single).click();
      cy.get(pageObj.Skills_1).type(persona.Skills[0]);
      cy.get(pageObj.Skills_2).type(persona.Skills[1]);
      cy.get(pageObj.Skills_3).type(persona.Skills[2]);
      cy.get(pageObj.Pains).type(persona.Pains);
      cy.get(pageObj.Gains).type(persona.Gains);
      cy.get(pageObj.Jobs_to_be_done).type(persona.Jobs_to_be_done);
      cy.get(pageObj.Pain_relievers).type(persona.Pain_relievers);
      cy.get(pageObj.Gain_creators).type(persona.Gain_creators);
      cy.get(pageObj.Product_and_services).type(persona.Product_and_services);
      cy.get(pageObj.Download).click();
      cy.get(pageObj.Download).click();
      cy.get(pageObj.Send_name).type(persona.Send_name);
      cy.get(pageObj.Send_role).select(persona.Send_role);
      cy.get(pageObj.Send_company).type(persona.Send_company);
      cy.get(pageObj.Send_email).type(persona.Send_email);
      cy.get(pageObj.Send_consent).click();
      cy.get(pageObj.Send_button).click();
    });

    it("removes and adds Pains section", () => {
      cy.get(pageObj.Delete_pains).click({ force: true });
      cy.get(pageObj.Add_element_title).should("have.text", "New item");
      cy.get(pageObj.Add_element).click();
      cy.get(pageObj.Add_pains).click();
      cy.get(pageObj.Last_element).should("have.text", "Pains");
    });
  });
});
