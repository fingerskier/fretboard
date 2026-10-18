# Fretboard Explorer

UX for exploring the guitar fretboard

## Develop

```sh
npm ci
npm start   # http://localhost:3000/fretboard
npm test
```

## Deploy

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): it tests, builds, and deploys `build/` to <https://fingerskier.github.io/fretboard>. Pull requests run the tests and build without deploying. To redeploy without a push, run the workflow from the Actions tab.

This needs Settings → Pages → Source set to **GitHub Actions**, and the `github-pages` environment must allow deploys from `main`.
