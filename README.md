# basilStream

basilStream is a Node.js application with a simple interface to track growth of plants by storing surface area data on to the [@iotaledger](https://github.com/iotaledger)

*Notice: basilStream was build for presentation purposes only and should not be used if accurate measuring is needed. Its purpose is to show a concept of transparency in supply chains.*

## Hardware setup

The surface area of the plant is being tracked by a color detection script handling an incoming camera stream.

The current hardware setup is a `Logitech C270` webcam connected to a `Raspberry Pi 3 Model B`. The front-end interface is displayed on a `Dell UltraSharp 1907` monitor in portrait orientation.

# Installing basilStream

basilStream is build with the JavaScript runtime [Node.js](https://nodejs.org).

## Installing Node.js

To install Node.js we are using [Node Version Manager](https://github.com/creationix/nvm). It's pretty straight forward and allows you to easily switch node versions if needed.

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

Then we install the lastest node version

```shell
nvm install latest
```
> If `nvm` isn't found run your `~/.bashrc` file once.

To check your node version just

```shell
node -v
```

## Cloning the repository

To get basilStream version 1.0.2 we clone from here

```bash
git clone git@github.com:cccccccccccccccccnrd/basilStream.git
```

and install the node modules with [npm](https://www.npmjs.com/) which came with the Node.js installation

```bash
npm install
```

## Starting basilStream

To run basilStream simply execute the `index.js` file with node.

```bash
node index.js
```

# Configuring basilStream

## Setup environment variables

To successfully connect to the distributed ledger from IOTA we have to setup some environment variables.

We start with creating a `.env` file in the root directory and setting it up with the following variables: `SEED`, `ADDRESS`, `NODE` and `PLANTID`.

Your `.env` should look something like this:

```
SEED = AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ADDRESS = AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
NODE = http://localhost:14265
PLANTID = first-prototype@home
```
> This is how you generate an IOTA Seed: [Generate a Seed](https://helloiota.com/generate-seed.html) and how to generate an address from the seed: [Generating Addresses: Learn the Basics](https://learn.iota.org/tutorial/generating-addresses-learn-the-basics)

> A public list of IOTA full nodes that allow Proof of Work done on the node itself can be found here:
[iota.dance](http://iota.dance/nodes)

## Setup tracker

To setup the tracker we look at the front-end script dealing with the incoming camera stream: `./public/js/interface.js`

The following lines are setting a custom color for the tracker. Adjust the statement to optimize the tracking.

```javascript
tracking.ColorTracker.registerColor('custom', function(r, g, b) {
  if ((g - r) >= 30 && (g - b) >= 10) {
    return true
  }
})
```

## Setup data bundle

The following function generates the data bundle which is send to the Tangle. You can find the function `bundleData` in `./basilstream.js`.

```javascript
function bundleData(surfaceArea) {
  let id = process.env.PLANTID
  let d = new Date()
  let timestamp = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes()

  let dataBundle = {
    id: id,
    timestamp: timestamp,
    surface_area: surfaceArea
  }

  sendDataToTangle(dataBundle)
}
```

For now the data bundle consists out of three parameters: The ID of the plant `id`, a timestamp when the data was captured `timestamp` and the surface area `surface_area`.

# Interface and Settings

The interface is served using a http-server on `http://127.0.0.1:3000`.

Since the monitor is a `Dell UltraSharp 1907` in portrait orientation, the interface is optimized for a `1024x1280px` resolution. The interface itself is very minimalistic and only has four components.

![Interface](https://i.imgur.com/SXTdfDI.png)

## Camera stream and tracking visualization (1)

The main visual part of the interface is the camera stream which is used to track the plant. The tracking algorithm is visualized through a red rectangle which is updating every animation frame.

## Surface area (2)

The first line below the camera stream is the current value of the tracked surface area.

## Data bundle (3)

Below the surface area you see the last sent data bundle. With each post request to the server a new data bundle is send to the Tangle.
> To set the interval of the transfer see [Setup tracker](configuration.md#setup-tracker)

## Transaction hash (4)

The last paragraph shows the hash of the last transaction that was send to the Tangle.
> You can use a [Tangle explorer](http://www.thetangle.org) to find the transaction and to look at the data bundle that was send with it.

## Settings

basilStream serves a second http-server on `http://127.0.0.1:4000` to give access to additional settings.

`interval` defines the interval in which the data bundle is send to the Tangle (in minutes).

`distance` defines the distance between the camera and the top of the plant (in millimeters).
> Feature in basilStream 1.0.3: Arduino + HC-SR04 setup which will automatically measure the distance.
