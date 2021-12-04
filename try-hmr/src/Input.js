import React, { useState } from 'react';
import color from './color';

/////////////////////////////////////
const M = createPersistentModule();
const HMR= createHMRWrapper(M);
/////////////////////////////////////

export default HMR(function Input() {
  const [v, setV] = useState('');
  return React.createElement('input', {
    style: {
      height: 50,
      width: '100%',
      fontSize: 20,
      color,
    },
    value: v,
    onChange: e => setV(e.target.value)
  });
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
