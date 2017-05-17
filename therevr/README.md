# Technologies

## Front-End

- [React](https://facebook.github.io/react/)
- [Redux](http://redux.js.org/docs/introduction/)
- [Redux-Saga](https://github.com/redux-saga/redux-saga)
- [Immutable.js](https://facebook.github.io/immutable-js/)

## Back-End

- [Express.js](http://expressjs.com/)
- [Mongoose](http://mongoosejs.com/)
- [AWS S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html)
- [Socket.io](http://socket.io/)

# Starting Up App

## Basics

- Go to root of project.
- `npm install`
- `npm start`
- point your browser to localhost:8000!

## Setting Up Linting

Adhering to the [AirBnB style guide](https://github.com/airbnb/javascript)

- Atom install the [es-lint extension](https://github.com/AtomLinter/linter-eslint)
- Sublime Text [This article will get you through it](http://jonathancreamer.com/setup-eslint-with-es6-in-sublime-text/)
- VS Code install the [es-lint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

# Folder structure
```
-App
  ----components
  ------ExampleComponent
  --------index.js
  --------tests
  ----containers
  ------ExampleContainer
  --------tests
  --------index.js
  --------actions.js
  --------sagas.js
  --------constants.js
  ----tests (general tests)
  ----translations (in case wee nedd multiple laguages)
  ----utils
  ----app.js (Entry point for front-end)
  ----reducer.js (reducers config)
  ----store (store config)
  ----routes (route config)
  ----internals (Scripts, build processes.)
  ----server (more will be added to this folder)
-server
  ----config (All server config files live here)
  ----controllers
  ----middlewares (Front-end middlewares)
  ----models
  ----routes
  ----index.js (Entry point for the back-end)
```

# Scripts

## Basics

`npm start` - Starts server and runs application on localhost:3000

`npm start:tunnel` - Exposes port to test on different computers/cellphones. Link in terminal

`npm run build` - Packages up app, minifies all files.

`npm run start:prod` - Run after `npm run build` to serve the file.


## Testing and Linting

`npm run lint` - Lints files and shows errors.

`npm run test` - Runs all files *.test.js and shows coverage.

`npm run test:watch` - Watches test files updates on save and re-runs tests.

## Generators

`npm run generate` - CLI to generate boilerplate for a component, container, route.

`npm run generate [ component || container || route ]` - Shortcut to generate specific component.
