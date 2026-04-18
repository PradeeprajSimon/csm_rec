import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Event: a.model({
    title: a.string().required(),
    description: a.string(),
    date: a.string().required(),
    time: a.string().required(),
    location: a.string(),
    category: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
