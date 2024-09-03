import { graphql, list } from "@keystone-6/core";

import {
  text,
  relationship,
  password,
  timestamp,
  calendarDay,
  virtual,
  file,
  multiselect,
} from "@keystone-6/core/fields";

import { document } from "@keystone-6/fields-document";

import { type Lists } from ".keystone/types";
import { pub } from "./auth";

export const lists = {
  User: list({
    access: pub,
    ui: {
      isHidden: true,
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({ validation: { isRequired: true } }),
      posts: relationship({ ref: "Post.author", many: true }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),
  Job: list({
    access: pub,
    ui: {
      isHidden: true,
    },
    fields: {
      employer: text({ label: "Employer", validation: { isRequired: true } }),
      employerSite: text({ label: "Employer Website" }),
      title: text({ label: "Title", validation: { isRequired: true } }),
      bio: text({
        ui: { displayMode: "textarea" },
        validation: { isRequired: true },
      }),
      startDate: calendarDay({
        label: "Start Date",
        validation: { isRequired: true },
      }),
      endDate: calendarDay({ label: "End Date" }),
    },
  }),
  About: list({
    access: pub,
    isSingleton: true,
    fields: {
      jobs: relationship({
        ref: "Job",
        many: true,

        ui: {
          displayMode: "cards",
          cardFields: [
            "employer",
            "employerSite",
            "title",
            "bio",
            "startDate",
            "endDate",
          ],
          inlineEdit: {
            fields: [
              "employer",
              "employerSite",
              "title",
              "bio",
              "startDate",
              "endDate",
            ],
          },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: {
            fields: [
              "employer",
              "employerSite",
              "title",
              "bio",
              "startDate",
              "endDate",
            ],
          },
        },
      }),
      minibios: relationship({
        ref: "MiniBio",
        many: true,

        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),
    },
  }),
  MiniBio: list({
    access: pub,

    ui: {
      isHidden: true,
    },

    fields: {
      name: text({ validation: { isRequired: true } }),
    },
  }),
  Post: list({
    access: pub,
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",

        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },

        many: false,
      }),

      tags: relationship({
        ref: "Tag.posts",

        many: true,

        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),
    },
  }),
  Folder: {
    access: pub,
    fields: {
      title: text({ validation: { isRequired: true } }),
      isRoot: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          async resolve(item, args, ctx, info) {
            const res: { foldersCount: number } = await ctx.graphql.run({
              query: `
              query CountParentFolders($id: ID) {
                foldersCount(where: {
                  subfolders: {
                    some: {
                      id: {
                        equals: $id
                      }
                    }
                  }
                })
              }
            `,
              variables: { id: item.id },
            });

            return res.foldersCount == 0;
          },
        }),
      }),
      files: relationship({
        ref: "File",
        many: true,
      }),
      subfolders: relationship({
        ref: "Folder",
        many: true,

        ui: {
          displayMode: "cards",
          cardFields: ["title"],
          inlineEdit: { fields: ["title"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["title"] },
        },
      }),
    },
  },
  File: {
    access: pub,
    ui: {
      isHidden: true,
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      file: file({ storage: "local" }),
    },
  },
  Tag: list({
    access: pub,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: "Post.tags", many: true }),
    },
  }),
} satisfies Lists;
