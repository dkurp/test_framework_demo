let sessionToken = "";

describe("Article api tests", () => {
  beforeEach(() => {
    cy.request("POST", "/api/users/login", { user: { email: "testacc@niepodam.pl", password: "Temp1234" } }).then(
      (res) => {
        sessionToken = res.body["user"]["token"];
      }
    );
  });

  context("Get and filter list of articles", () => {
    it("gets list of articles", () => {
      cy.request("/api/articles").then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(20);
      });
    });

    it("filters list of articles by tag=microchip", () => {
      cy.request({ url: "/api/articles", qs: { tag: "microchip" } }).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(14);
      });
    });

    it("filters list of articles by author=mikemyers", () => {
      cy.request({ url: "/api/articles", qs: { author: "mikemyers" } }).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(20);
      });
    });

    it("filters list of articles by favorited=testacc", () => {
      cy.request({ url: "/api/articles", qs: { favorited: "testacc" } }).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(6);
      });
    });

    it("filters list of articles by limit=65", () => {
      cy.request({ url: "/api/articles", qs: { limit: "65" } }).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(65);
      });
    });

    it("filters list of articles by offset=256", () => {
      cy.request({ url: "/api/articles", qs: { limit: "256" } }).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(256);
      });
    });
  });

  context("Other article endpoints", () => {
    let slug;
    let defFeed;
    it("gets articles feed", () => {
      const options = {
        method: "GET",
        url: "/api/articles/feed",
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        defFeed = res.body.articles;
      });
    });

    it("filters articles feed by offset=15", () => {
      const options = {
        method: "GET",
        url: "/api/articles/feed",
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
        qs: {
          offset: 15,
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(res.body.articles).to.not.equal(defFeed);
      });
    });

    it("filters articles feed by limit=77", () => {
      const options = {
        method: "GET",
        url: "/api/articles/feed",
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
        qs: {
          limit: 77,
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
        expect(Object.keys(res.body.articles).length).to.equal(77);
      });
    });

    it("gets single article and verifies content", () => {
      cy.request("/api/articles/romans-838-39-kg5wf2").then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.body.article.author.username).to.equal("mikemyers");
        expect(res.body.article.body).to.equal("");
        expect(res.body.article.createdAt).to.equal("2021-02-25T17:56:18.878Z");
        expect(res.body.article.description).to.equal("Popular Bible quote");
        expect(res.body.article.favorited).to.equal(false);
        expect(res.body.article.title).to.equal("Romans 8:38-39");
      });
    });

    it("creates new post", () => {
      const options = {
        method: "POST",
        url: "/api/articles",
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
        body: {
          article: {
            title: "Cypress API test",
            description: "This was created using cypress on API",
            body: "This test creates new post using page API and cypress test suite",
            tagList: ["cypress", "test", "QA"],
          },
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.body.article.author.username).to.equal("testacc");
        expect(res.body.article.body).to.equal(options.body.article.body);
        expect(res.body.article.description).to.equal(options.body.article.description);
        expect(res.body.article.favorited).to.equal(false);
        expect(res.body.article.title).to.equal(options.body.article.title);
        expect(res.body.article.tagList[0]).to.equal(options.body.article.tagList[0]);
        expect(res.body.article.tagList[1]).to.equal(options.body.article.tagList[1]);
        expect(res.body.article.tagList[2]).to.equal(options.body.article.tagList[2]);
        slug = res.body.article.slug;
      });
    });

    it("updates post", () => {
      const options = {
        method: "PUT",
        url: `/api/articles/${slug}`,
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
        body: {
          article: {
            title: "Cypress API test update",
            description: "This was created updated using cypress on API",
            body: "This test updates post using page API and cypress test suite",
            tagList: ["cypress", "test", "QA", "update"],
          },
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.body.article.author.username).to.equal("testacc");
        expect(res.body.article.body).to.equal(options.body.article.body);
        expect(res.body.article.description).to.equal(options.body.article.description);
        expect(res.body.article.favorited).to.equal(false);
        expect(res.body.article.title).to.equal(options.body.article.title);
        expect(res.body.article.tagList[0]).to.equal(options.body.article.tagList[0]);
        expect(res.body.article.tagList[1]).to.equal(options.body.article.tagList[1]);
        expect(res.body.article.tagList[2]).to.equal(options.body.article.tagList[2]);
        slug = res.body.article.slug;
      });
    });

    it("adds post to favorites", () => {
      const options = {
        method: "POST",
        url: `/api/articles/${slug}/favorite`,
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
      });
    });

    it("removes post from favorites", () => {
      const options = {
        method: "DELETE",
        url: `/api/articles/${slug}/favorite`,
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
      };
      cy.request(options).then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        expect(res.status).to.equal(200);
      });
    });

    it("deletes post", () => {
      const options = {
        method: "DELETE",
        url: `/api/articles/${slug}`,
        headers: {
          jwtauthorization: `Token ${sessionToken}`,
        },
      };
      cy.request(options).then((res) => {
        expect(res.status).to.equal(204);
      });
    });

    it("gets a list of tags", () => {
      cy.request("/api/tags").then((res) => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8");
        console.log(res.body);
      });
    });
  });
});
