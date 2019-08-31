import React, { useContext, useReducer } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/home'
import Context from './context'
import Reducer from './reducer'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SubscriptionClient } from "subscriptions-transport-ws";

const GRAPHQL_ENDPOINT = "wss://radiant-lake-34932.herokuapp.com/graphql";

const wsLink = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true
});

const link = new WebSocketLink(wsLink);
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})



function App() {
  const initialState = useContext(Context)
  const [state, dispatch] = useReducer(Reducer, initialState)
  return (
    <HashRouter>
    <ApolloProvider client={client} >
    <Context.Provider value={{state,dispatch}}>
    <Switch>
    <Route path="/" component={Home} />
    </Switch>
    </Context.Provider>
    </ApolloProvider>
    </HashRouter>
  );
}

export default App;
