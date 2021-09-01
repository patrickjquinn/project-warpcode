# Warp Code IDE

An electron based Svelte app builder using Vite for the UI (Svelte based) and Rollup for the Electron components (Typescript).

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
$(npm bin)/electron-rebuild
```

On .nix machines (Mac, Linux, BSD)

And:

```
.\node_modules\.bin\electron-rebuild.cmd
```

On NT machines (Windows, ReactOS, Wine).

And then run:

```
pnpm rebuild
```


