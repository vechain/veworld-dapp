# VeWorld Sample DApp

A sample DApp that demonstrates how to create Connex instances for VeWorld <b>OR</b> Sync2.

This DApp was built with create-react-app

## Available Scripts

In the project directory, you can run:

### `cp .env.example .env`

Add the environment variables in your .env file.

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

This DApp uses a `ConnexProvider` to handle the initialization of Connex. The `ConnexProvider` is a React Context Provider that wraps the entire application.

Please refer to [this file](./src/context/ConnexContext.tsx) for our implementation of the `ConnexProvider`.

- *Note*: The `ConnexProvider` is wrapped inside a `WalletConnectProvider`. The wallet connect provider handles all the wallet connect logic, and exports a function to create a connex vendor.

To use connex, you can do the following:
```typescript
import {useConnex} from "src/context/ConnexContext"

const {thor, vendor} = useConnex()

```


## Wallet Connect

- Please refer to the [wallet connect docs](https://docs.walletconnect.com/2.0/web3modal/about) for more information on how to use wallet connect.

- Please refer to [this file](./src/context/WalletConnectContext.tsx) for an example of how to use the Wallet Connect in your vechain dApp.

- A web3Modal must be constructed to connect:

```typescript
const web3Modal = new WalletConnectModal({
  // You must create a project on wallet connect to get a project ID
  projectId: DEFAULT_PROJECT_ID,
  explorerRecommendedWalletIds: "NONE",
  // This will show the VeWorld wallet on iOS
  // On android, the wallet will automatically be detected if it is installed
  mobileWallets: [
    {
      name: "VeWorld",
      id: "veworld-mobile",
      links: {
        native: "veworld://org.vechain.veworld.app/",
        universal: "https://veworld.net",
      },
    },
  ],
  //This ensures that the Wallet Connect modal appears at the top of the page
  themeVariables: {
    "--wcm-z-index": "99999999",
  },
  //This image is displayed for the VeWorld mobile wallet on iOS
  walletImages: {
    "veworld-mobile": process.env.PUBLIC_URL + "/images/logo/veWorld.png",
  },
})
```

