import moment from "moment";

let sessionToken = "";

describe("User api tests", () => {
  beforeEach(() => {
    cy.request("POST", "/api/users/login", { user: { email: "testacc@niepodam.pl", password: "Temp1234" } }).then(
      (res) => {
        sessionToken = res.body["user"]["token"];
      }
    );
  });

  it("logs in | authentication", () => {
    cy.request("POST", "/api/users/login", { user: { email: "testacc@niepodam.pl", password: "Temp1234" } }).then(
      (res) => {
        expect(res.status).to.equal(200);
      }
    );
  });

  it("gets current user", () => {
    const options = {
      method: "GET",
      url: "/api/user",
      headers: {
        jwtauthorization: `Token ${sessionToken}`,
      },
    };
    cy.request(options).then((res) => {
      expect(res.status).to.equal(200);
    });
  });

  it("updates user's info", () => {
    const now = moment().format("MMMM Do YYYY, hh:mm:ss");
    const response = {
      user: {
        bio: `updated at ${now}`,
        email: "testacc@niepodam.pl",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4R12D4_FXGc8ZVZjAvWyieZawvYIrNJEpSg&usqp=CAU",
        token: `${sessionToken}`,
      },
    };
    const options = {
      method: "PUT",
      url: "/api/user",
      headers: {
        jwtauthorization: `Token ${sessionToken}`,
      },
      body: {
        user: {
          email: "testacc@niepodam.pl",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4R12D4_FXGc8ZVZjAvWyieZawvYIrNJEpSg&usqp=CAU",
          token: `${sessionToken}`,
          bio: `updated at ${now}`,
        },
      },
    };
    cy.request(options).then((res) => {
      expect(res.body.user.bio).to.contain(response.user.bio);
      expect(res.status).to.equal(200);
    });
  });

  it("registers new user", () => {
    const now = moment().format("MMMMDoYYYYhhmmss").toLowerCase();
    const options = {
      method: "POST",
      url: "/api/users",
      body: {
        user: {
          email: `testacc+${now}@testmail.pl`,
          username: `auttest${now}`,
          password: "auttest123",
        },
      },
    };

    cy.request(options).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.user.email).to.equal(options.body.user.email);
      expect(res.body.user.username).to.equal(options.body.user.username);
      expect(res.body.user.token).to.have.lengthOf.above(22);
    });
  });

  it("gets user profile", () => {
    const options = {
      method: "GET",
      url: "/api/profiles/testacc",
    };
    cy.request(options).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.profile.bio).to.contain("updated at");
      expect(res.body.profile.image).to.have.lengthOf.above(20);
      expect(res.body.profile.username).to.equal("testacc");
    });
  });

  it("follows user", () => {
    const options = {
      method: "POST",
      url: "/api/profiles/qatestsample/follow",
      headers: {
        jwtauthorization: `Token ${sessionToken}`,
      },
    };

    cy.request(options).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.profile.following).to.be.true;
      expect(res.body.profile.image).to.equal("https://static.productionready.io/images/smiley-cyrus.jpg");
      expect(res.body.profile.username).to.equal("qatestsample");
    });
  });

  it("unfollows user", () => {
    const options = {
      method: "DELETE",
      url: "/api/profiles/qatestsample/follow",
      headers: {
        jwtauthorization: `Token ${sessionToken}`,
      },
    };

    cy.request(options).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.profile.following).to.be.false;
      expect(res.body.profile.image).to.equal("https://static.productionready.io/images/smiley-cyrus.jpg");
      expect(res.body.profile.username).to.equal("qatestsample");
    });
  });
});
