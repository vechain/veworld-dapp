# VeWorld Sample DApp

A sample DApp that demonstrates how to create Connex instances for VeWorld <b>OR</b> Sync2.

This DApp was built with create-react-app

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

If you wish to serve the production build locally:
`yarn build`
`npm install -g serve`
`serve -s build`

## Connex Initialization

### Pre-requisites

- `@vechain/connex` (`2.0.14` or higher)

### Check if VeWorld is installed

```typescript
console.log('VeWorld is installed: ', !!window.vechain);
```

### Initialise Connex for VeWorld (No changes required):

```typescript
const connex = new Connex({
  node: "https://vethor-node.vechain.com",
  network: "main"
})
```

- If VeWorld is not installed, Sync2 will be used instead.

### Initialise Connex for Sync2:

```typescript
const connex = new Connex({
  node: "https://vethor-node.vechain.com",
  network: "main",
  noExtension: true,
})
```
