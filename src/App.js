import { BrowserRouter } from 'react-router-dom';
import RemoteLoader from '@kne/remote-loader';
import Agent from './Agent';

const App = ({ globalPreset }) => {
  return (
    <RemoteLoader module="components-core:Global" themeToken={globalPreset.themeToken} preset={globalPreset}>
      <BrowserRouter>
        <Agent />
      </BrowserRouter>
    </RemoteLoader>
  );
};

export default App;
