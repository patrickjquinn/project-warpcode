# Warp Code IDE

An electron based Svelte app builder that allows you to visually create applications, whilst generating clean Svelte code, using Vite for the UI build step (Svelte based) and Rollup for the Electron components (Typescript).

Capacitor is used to build and deploy to mobile applications.

It will also support standard web and native desktop applications down the line.

Note: This is in very early pre-alpha and serves as proof of concept in it's current state. Here be dragons, etc etc.

Active contributors very welcome.

## What does it look like (for now)?

![alt text](https://github.com/patrickjquinn/project-warp/blob/main/warp.png?raw=true)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Setting up Warp on your machine

```
npn i -g pnpm
pnpm i
pnpm dev:all
```

## Troubleshooting

If the 'dev:all' command failed to execute because of node-pty.

Run:

```
pnpm rebuild
```

And then:

```
$(npm bin)/electron-rebuild
```

On .nix machines (Mac, Linux, BSD)

And:

```
.\node_modules\.bin\electron-rebuild.cmd
```

On NT machines (Windows, ReactOS, Wine).

## Trying it out.

Once you have the service running, create a new project with the onscreen option to do so. It will download and initialize the project from another template repo. By default it will open the README file but if you navigate to `src/pages/index.svelte` the editor will appear and allow you interact with the visual canvas.

Now in the top options bar, click the 'Run+Build' tab and then 'Run Web'. This will start the poject's Vite server in dev mode and changes made in code or on the canvas will reflect in real time.
