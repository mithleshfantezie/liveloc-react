import React,{ Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const App  = React.lazy(()=>import('./App'))

ReactDOM.render(
    <Suspense fallback={<div className="loading">
    <div><img src="LiveLoc.svg" height="100px" width="70px" alt="logo" /></div>
    <div className="logo">LiveLoc</div>
    <div className="lds-ripple"><div></div><div></div></div>
   </div>}>
    <App/>
    </Suspense>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
