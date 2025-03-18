import { createWithRemoteLoader } from '@kne/remote-loader';
import { FloatButton, Popover, Result } from 'antd';
import Fetch from '@kne/react-fetch';
import { useState } from 'react';
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
  modules: ['components-core:Global@usePreset', 'leapin-ai-agent:ChatBotClient']
})(({ remoteModules }) => {
  const [usePreset] = remoteModules;
  const [open, setOpen] = useState(false);
  const { options } = usePreset();
  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={open => {
        setOpen(open);
        options.onVisibleChange?.(open);
      }}
      rootClassName={style['chatbot']}
      content={<ChatBot />}
      arrow={false}
      placement="top"
    >
      <FloatButton className={style['float-button']} icon={<LogoIcon style={{ width: '40px', height: '40px', position: 'absolute', left: '0px', top: '0px' }} />} />
    </Popover>
  );
});

export default Agent;
