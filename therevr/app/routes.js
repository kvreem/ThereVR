// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
/* eslint-disable */
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { browserHistory } from 'react-router';
const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

function auth(nextState, replace, callBack) {
  // If the local storage id does not match the localStorage id, bring to home
  if (nextState.params.userId !== JSON.parse(localStorage.getItem('currentUser')).user_id) {
    browserHistory.push('/welcome');
    return;
  }
  callBack();
}

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'login',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Login'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/terms',
      name: 'terms',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Terms'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Privacy'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/welcome',
      name: 'login',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Login'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/home',
      name: 'dashboard',
      // onEnter: auth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Dashboard'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/contacts/:selected/:currentUserId',
      name: 'contacts',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Contacts'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/profile/:userId',
      name: 'profile',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Profile'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/:currentUser/call/:contactUser',
      name: 'call',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Call'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/room/:roomId',
      name: 'room',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Room'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/vr',
      name: 'vrview',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          // import('containers/Vrview/reducer'),
          // import('containers/Vrview/sagas'),
          import('containers/Vrview'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          // injectReducer('authoc', reducer.default);
          // injectReducer('vrview', reducer.default);
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/bluetooth',
      name: 'bluetooth',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/AuthHoc/reducer'),
          import('containers/AuthHoc/sagas'),
          import('containers/Bluetooth'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('user', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },{
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}