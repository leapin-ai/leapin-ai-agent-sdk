import { globalInit } from './preset';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { v4 as uuidv4 } from 'uuid';

const uuidKey = 'LEAPIN_AI_AGENT_SDK_UUID';

if (!window.localStorage.getItem(uuidKey)) {
  window.localStorage.setItem(uuidKey, uuidv4());
}

const renderRoot = async (root, options) => {
  const globalPreset = await globalInit(options);
  root.render(<App themeToken={globalPreset.themeToken} globalPreset={globalPreset} />);
};

const leapinAiAgentSDK = (options, target) => {
  if (!target) {
    if (document.getElementById('leapin-ai-agent-sdk-default')) {
      target = document.getElementById('leapin-ai-agent-sdk-default');
    } else {
      const dom = document.createElement('div');
      dom.setAttribute('id', 'leapin-ai-agent-sdk-default');
      document.body.appendChild(dom);
      target = dom;
    }
  }
  if (!options.secret || !options.host) {
    console.warn('Please use LeapIn Business to obtain the secret key and host');
    return;
  }

  if (!window.localStorage.getItem(uuidKey)) {
    console.warn('Unable to identify user identity, please refresh the page and try again');
    return;
  }

  const root = ReactDOM.createRoot(target);
  return renderRoot(root, Object.assign({}, options, { uuid: window.localStorage.getItem(uuidKey) }));
};

export default leapinAiAgentSDK;
