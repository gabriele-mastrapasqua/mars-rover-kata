# Mars rover kata

This is the mars rover kata inspired by [https://kata-log.rocks/mars-rover-kata](https://kata-log.rocks/mars-rover-kata) using typescript, nextjs 12, react and jest for unit testing!

You can try it live here: [https://mars-rover-kata.vercel.app/](https://mars-rover-kata.vercel.app/)

## Run in development

- Use a correct version of nodejs:

```bash
nvm use
```

- Install dependencies:

```bash
npm i
# or
yarn
```

- run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run with docker

You can run the app using docker running those commands:

```
docker build -t nextjs-docker .
docker run -p 3000:3000 nextjs-docker
```

then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run tests

Run unit tests:

```
yarn test
```

Run unit tests in watch mode:

```
yarn test:watch
```

Get the unit tests coverage:

```
yarn test:coverage
```
