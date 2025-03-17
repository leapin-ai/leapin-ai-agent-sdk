import { globalInit } from './preset';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
  const root = ReactDOM.createRoot(target);
  return renderRoot(root, options);
};

export default leapinAiAgentSDK;
