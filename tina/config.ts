import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main',

  // Get this from tina.io once the project is created.
  // These are read from env vars in CI/dev; TinaCloud injects them at build time.
  clientId: process.env.TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'prints',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'prints',
        label: 'Prints',
        path: 'src/data',
        format: 'json',
        ui: {
          global: true,
          filename: {
            readonly: true,
            slugify: () => 'prints',
          },
        },
        fields: [
          {
            type: 'object',
            name: 'prints',
            label: 'Prints',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || 'Untitled print' }),
            },
            fields: [
              { type: 'string', name: 'slug', label: 'Slug', isTitle: true, required: true },
              { type: 'string', name: 'title', label: 'Title', required: true },
              { type: 'string', name: 'artist', label: 'Artist', required: true },
              { type: 'number', name: 'price', label: 'Price', required: true },
              { type: 'string', name: 'size', label: 'Size', required: true },
              { type: 'string', name: 'paper', label: 'Paper', required: true },
              { type: 'string', name: 'edition', label: 'Edition', required: true },
              {
                type: 'image',
                name: 'images',
                label: 'Images',
                list: true,
                required: true,
                ui: {
                  previewSrc: (src) => src,
                },
              },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              { type: 'string', name: 'buyUrl', label: 'Stripe buy URL' },
              { type: 'boolean', name: 'featured', label: 'Featured' },
            ],
          },
        ],
      },
    ],
  },
});
