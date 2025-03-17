import { createWithRemoteLoader } from '@kne/remote-loader';
import { FloatButton, Popover, Result } from 'antd';
import Fetch from '@kne/react-fetch';
import { ReactComponent as LogoIcon } from './logo.svg';

const ChatBot = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'leapin-ai-agent:ChatBotClient']
})(({ remoteModules }) => {
  const [usePreset, ChatBotClient] = remoteModules;
  const { options, apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.agent.chatBotClient.createChatBot, {
        params: { app_secret: options.secret }
      })}
      render={({ data }) => {
        return (
          <ChatBotClient
            code={data.code}
            error={err => {
              return <Result status="500" title="ERROR" subTitle={err} />;
            }}
          />
        );
      }}
    />
  );
});

const Agent = () => {
  return (
    <Popover trigger="click" content={<ChatBot />} arrow={false} placement="top">
      <FloatButton style={{ overflow: 'hidden' }} icon={<LogoIcon style={{ width: '40px', height: '40px', position: 'absolute', left: '0px', top: '0px' }} />} />
    </Popover>
  );
};

export default Agent;
