import React from 'react';
import { preset as fetchPreset } from '@kne/react-fetch';
import { Spin, Empty, message } from 'antd';
import axios from 'axios';
import { preset as remoteLoaderPreset, loadModule } from '@kne/remote-loader';
import omit from 'lodash/omit';
import transform from 'lodash/transform';
import qs from 'qs';

export const globalInit = async options => {
  options = Object.assign({}, options);

  const ajax = (() => {
    const instance = axios.create({
      baseURL: options.host,
      validateStatus: function () {
        return true;
      }
    });

    instance.interceptors.request.use(config => {
      if (config.method.toUpperCase() !== 'GET' && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    });

    instance.interceptors.response.use(
      response => {
        if (response.status !== 200 || (response.data.hasOwnProperty('code') && response.data.code !== 0 && response.config.showError !== false)) {
          message.error(response?.data?.msg || response?.data?.error_msg?.detail || response?.data?.error_msg || '请求发生错误');
        }
        return response;
      },
      error => {
        message.error(error.message || '请求发生错误');
        return Promise.reject(error);
      }
    );

    const parseUrlParams = params => {
      if (typeof params.urlParams === 'object' && Object.keys(params.urlParams).length > 0 && typeof params.url === 'string') {
        params.url = params.url.replace(/{([\s\S]+?)}/g, (match, name) => {
          return params.urlParams.hasOwnProperty(name) ? params.urlParams[name] : match;
        });
      }
    };

    const ajax = params => {
      if (params.hasOwnProperty('loader') && typeof params.loader === 'function') {
        return Promise.resolve(params.loader(omit(params, ['loader'])))
          .then(data => ({
            data: {
              code: 0,
              data
            }
          }))
          .catch(err => {
            message.error(err.message || '请求发生错误');
            return { data: { code: 500, msg: err.message } };
          });
      }
      parseUrlParams(params);
      return instance(params);
    };

    ajax.sse = config => {
      parseUrlParams(config);
      const { url, params, urlParams, data, method, eventEmit } = config;
      const queryString = qs.stringify(
        transform(
          Object.assign({}, params, data),
          (result, value, key) => {
            if (value !== void 0) {
              result[key] = value;
            }
          },
          {}
        )
      );

      return new Promise(resolve => {
        const eventSource = new EventSource(`${options.host}${url}${queryString ? '?' + queryString : ''}`);
        const result = [];
        eventSource.onmessage = event => {
          // 处理服务器推送的消息
          const data = JSON.parse(event.data);
          result.push(data);
          eventEmit && eventEmit(data, result);
          if (['error', 'message_end'].indexOf(data.event) > -1) {
            eventSource.close();
            resolve(result);
          }
        };
        eventSource.onerror = error => {
          eventSource.close();
          resolve(result);
        };
      });
    };

    return ajax;
  })();
  fetchPreset({
    ajax,
    loading: (
      <Spin
        delay={500}
        style={{
          position: 'absolute',
          left: '50%',
          padding: '10px',
          transform: 'translateX(-50%)'
        }}
      />
    ),
    error: null,
    empty: <Empty />,
    transformResponse: response => {
      const { data } = response;
      response.data = {
        code: data.code === 0 ? 200 : data.code,
        msg: data.msg,
        results: data.data
      };
      return response;
    }
  });
  const registry = {
    url: 'https://cdn.leapin-ai.com',
    tpl: '{{url}}/components/@kne-components/{{remote}}/{{version}}/build'
  };

  const componentsCoreRemote = {
    ...registry,
    remote: 'components-core',
    defaultVersion: '0.3.10'
  };
  remoteLoaderPreset({
    remotes: {
      default: componentsCoreRemote,
      'components-core': componentsCoreRemote,
      'components-iconfont': {
        ...registry,
        remote: 'components-iconfont',
        defaultVersion: '0.1.8'
      },
      'leapin-ai-agent': {
        url: options.host,
        tpl: options.tpl || '{{url}}/ai-agent',
        remote: 'leapin-ai-agent',
        defaultVersion: '0.1.0'
      }
    }
  });

  const getAgentApis = await loadModule('leapin-ai-agent:Apis@getApis').then(({ default: defaultModule }) => defaultModule);
  return {
    ajax,
    locale: 'en-US',
    apis: Object.assign({}, { agent: getAgentApis() }),
    options,
    themeToken: {
      colorPrimary: '#2257bf'
    }
  };
};
