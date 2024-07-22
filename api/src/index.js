"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const ext = ({ nexus }) => ({
      typeDefs: `
        type Spotify {
          name: String!
        }

        type Query {
          spotify: Spotify!
        }
      `,
      resolvers: {
        Query: {
          spotify: {
            resolve: async (parent, args, ctx) => {
              const data = await fetch(
                "https://spotify.holewinski.dev/current",
              ).then((resp) => resp.json());

              return data.item;
            },
          },
        },
      },
      resolversConfig: {
        "Query.spotify": {
          auth: false,
        },
      },
    });

    strapi.plugin("graphql").service("extension").use(ext);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
