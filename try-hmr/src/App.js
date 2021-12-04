import React, {useState} from 'react';
import Input from './Input';
import Text from './Text';
import color from './color';

///////////////////////////////////
const M = createPersistentModule();
const HMR= createHMRWrapper(M);
///////////////////////////////////

export default HMR(function App() {
  return React.createElement('div', {
      style: {
        background: color
      }
    },
    React.createElement(Text),
    React.createElement(Input)
  );
});

/////////////////////////////////////////////////
if (module.hot) M.eff.forEach(f => f());

import { useReducer, useEffect } from 'react';

export function createPersistentModule() {
  return { proxy: {}, impl: {}, eff: new Set() };
}

export function createHMRWrapper(M) {
  if (module.hot.data) Object.assign(M, module.hot.data);
  module.hot.dispose(data => Object.assign(data, M));;
  module.hot.accept();
  
  return function HMR(f) {
    const name = f.name;
    M.impl[name] = f;

    if (!M.proxy[name]) {
      M.proxy[name] = function (...args) {
        const [, forceUpdate] = useReducer(s => s + 1, 0);
        useEffect(() => {
          M.eff.add(forceUpdate);
          return () => {
            M.eff.delete(forceUpdate);
          }
        }, []);
        return M.impl[name](...args);
      };
      M.proxy[name].displayName = name;
    }
  
    return M.proxy[name];
  }
}
