Redux is a state management structure. So its in charge of all the states, Redux by nature is synchronous so to do async tasks we have to use the middleware `redux-sagas`. 

The benefit of it is that all your state is one place so say if I change a users status, I change it in one spot and all the components in react using that data will re render with the new data. So essentially get rid of `this.state` and use Redux. So at the bottom of AuthHoc and Login youll notice that its connecting to the Redux store and that we map the state to props and any actions in `mapDispatchToProps`. 

In `AuthHoc` you'll notice the props being passed down to what ever component is wrapped, so after the inital API call we have access to `this.props.user` which is all the user data. 

When a component is connected to the Redux store its called a smart component and if its not we call them dumb components. 

We want as many dumb components as possible as they have no side effects. Meaning the output of dumb component will always be the same given the same input `dumb`  and `smart` some people use `pure` and `un-pure`.

So when a user clicks go there, it triggers `handleGoThere` in the `Call` container. `handleGoThere` grabs the socket we attached in `AuthHoc` and emits the messsage `call:beingPLaced`. 

Now if we go to the `containers/AuthHoc/reducer.js` we can find that action type in the reducer as `case ACTIONS.CALL_USER` This is what wll change the state on line 113, we grab the logged in user's id on 114, we check if the user is calling on 115, we check if the user is being called in either event we switch the `beingCalled` boolean to true or leave it at false, same for the `calling` boolean now depending on these booleans if we go to `containers/Call/index.js` you'll see we access the `beingCalled` boolean we set in the reducer and that will change the color of the button. Or if the user isCalling we render 'Calling...' on the button `beingCalled` boolean on line 41` calling` boolean on line 60.

So were using socket.io http://socket.io/docs/ for web sockets. Web sockets allow you to push information to the client from the server and acts as a listner. This alows for instant comunication so you dont have to refresh the page for the status to change or to get a call. 

The pattern is socket.emit('what ever string you want') and then to catch that emit you socket.on('what ever string you want', (someInfo) => {  do something })
