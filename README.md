# Fretboard Explorer

UX for exploring the guitar fretboard

## Develop

```sh
npm ci
npm start   # http://localhost:3000/fretboard
npm test
```

## Deploy

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): it tests, builds, and publishes `build/` to the `gh-pages` branch, which serves <https://fingerskier.github.io/fretboard>. Pull requests run the tests and build without publishing. To deploy by hand, run `npm run deploy`.
