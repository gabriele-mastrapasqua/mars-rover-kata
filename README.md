# Mars rover kata

This is the mars rover kata using typescript, react and jest for unit testing!

## Run in development

To run the development server:

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
