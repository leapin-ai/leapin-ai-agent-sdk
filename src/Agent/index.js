import { createWithRemoteLoader } from '@kne/remote-loader';
import { FloatButton, Popover, Result } from 'antd';
import Fetch from '@kne/react-fetch';
import { ReactComponent as LogoIcon } from './logo.svg';
import style from './style.module.scss';

const ChatBot = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'leapin-ai-agent:ChatBotClient']
})(({ remoteModules }) => {
  const [usePreset, ChatBotClient] = remoteModules;
  const { options, apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.agent.chatBotClient.createChatBot, {
        params: { app_secret: options.secret, uuid: options.uuid }
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

const Agent = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules }) => {
  const [usePreset] = remoteModules;
  const { options } = usePreset();
  return (
    <Popover trigger="click" overlayClassName={style['chatbot']} content={<ChatBot />} arrow={false} placement="top">
      <FloatButton style={{ overflow: 'hidden', bottom: options.bottom || '120px', right: options.right || '10px' }} icon={<LogoIcon style={{ width: '40px', height: '40px', position: 'absolute', left: '0px', top: '0px' }} />} />
    </Popover>
  );
});

export default Agent;
