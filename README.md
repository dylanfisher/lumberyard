# 🪵 Lumberyard

Lumberyard is a simple starter theme for Shopify that provides just
enough structure to get started quickly prototyping a new store, but
not so much structure that you fight against the theme's defaults. Lumberyard
ships with Bootstrap 5 support out of the box.

Lumberyard assumes you want to make a completely bespoke theme for your client.
This blank slate offers a clean way to do that, but it does mean making sure you
implement all common features of a Shopify. These include add to cart functionality
based on stock availability, dynamic variant pickers, cart form, etc.

## TODO

- Run `shopify theme check` and fix issues and suggestions

## Developing

Lumberyard uses [esbuild](https://esbuild.github.io/) to bundle frontend
packages for the theme. The source frontend files are located in the `src`
directory.

The `index.mjs` file is used to define the esbuild configuration.

When working on your theme, you'll likely want to run the following commands
in separate terminal instances.

`shopify theme dev -e` Uploads the current theme as a development theme to the connected store, then
prints theme editor and preview URLs to your terminal. While running, changes
will push to the store in real time.

`npm run build` Run the esbuild script to compile frontend assets.

## Deploying

When you are ready to deploy your theme use `shopify theme push` to deploy the
code to your live theme. I suggest connecting your theme to GitHub using a separate
`production` branch. Shopify will automatically sync any changes made to the theme –
the schema, and the section and settings configurations that a user controls – back
to GitHub.

The `production` branch in this setup should be used as a read-only branch that is
only interacted with by the automatic Shopify integration. Any time you deploy changes,
do it locally from the `main` branch, using the `shopify theme push` command.

The only caveat is making sure to pull down changes from the production theme first
(the schema, settings, configuration changes, etc.). Do this using the
`shopify theme pull` command. It might be helpful to use the `--only` flag to
pull down just the configuration changes `shopify theme pull --only config/settings_data.json`.

## Required Theme Files

Make sure to search for `Find me in` when getting started in order to update
all required theme files with your own custom style and code.
