import { createWithRemoteLoader } from '@kne/remote-loader';
import { FloatButton, Popover, Result } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
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
  modules: ['components-core:Global@usePreset', 'components-core:Tooltip']
})(({ remoteModules }) => {
  const [usePreset, Tooltip] = remoteModules;
  const [open, setOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(true);
  const { options } = usePreset();
  const inner = (
    <FloatButton
      className={style['float-button']}
      type="primary"
      icon={
        open ? (
          <CloseOutlined />
        ) : (
          <LogoIcon
            style={{
              width: '40px',
              background: '#FFFFFF',
              height: '40px',
              position: 'absolute',
              left: '0px',
              top: '0px'
            }}
          />
        )
      }
    />
  );
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
      {options.tips ? (
        <Tooltip
          open={tipsOpen}
          trigger="click"
          content="Chat here to apply!"
          placement="left"
          onOpenChange={() => {
            setTipsOpen(false);
          }}
        >
          {inner}
        </Tooltip>
      ) : (
        inner
      )}
    </Popover>
  );
});

export default Agent;
