console.log('ready');
window.leapinAiAgentSDK = (...props) => {
  return import('./bootstrap').then(({ default: module }) => module(...props));
};
