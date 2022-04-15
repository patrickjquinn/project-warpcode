# Warp Code IDE

An electron based Svelte app builder that allows you to visually create applications, whilst generating clean Svelte code, using Vite for the UI build step (Svelte based) and Rollup for the Electron components (Typescript).

Capacitor is used to build and deploy to mobile applications.

## What does it look like?


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
