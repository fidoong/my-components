import type {CallableContent, Renderable} from "@/components/modal/src/type.ts";
import {
  type AppContext,
  type Component,
  type ComponentPublicInstance, createVNode,
  getCurrentInstance,
  isVNode, render, type VNode
} from "vue";

// 判断是否为可调用内容
const isCallableContent = (content: Renderable): content is CallableContent => {
  return typeof content === 'function'
    && !(content.prototype && (content.prototype as ComponentPublicInstance).$props);
};

// 判断组件
export const isVueComponent = (content: Renderable): content is Component => {
  if (typeof content === 'object' && !isVNode(content)) {
    return ['setup', 'render', 'data', 'props', 'emits'].some(key => key in content!);
  }
  if (typeof content === 'function' && !isCallableContent(content)) {
    const proto = content.prototype as ComponentPublicInstance;
    return Boolean(proto?.$props);
  }
  return false;
};

// app 上下文
export const getAppContext = (): AppContext | undefined => {
  return getCurrentInstance()?.appContext
};

// dialog容器
export const createContainer = (appendToBody: boolean = true): HTMLElement => {
  const _uuid = Math.random().toString(36).slice(2);
  const container = document.createElement('div');
  container.className = `modal-container__${_uuid}`;
  container.dataset.uuid = _uuid;
  const appRoot = appendToBody ? document.body : document.querySelector('#app');
  if (appRoot) {
    appRoot.appendChild(container);
  } else {
    document.body.appendChild(container);
  }
  return container;
};

// render
export const safeRender = (vnode: VNode | null, container: HTMLElement) => {
  try {
    render(vnode, container);
  } catch (e) {
    throw new Error(`模态框渲染失败: ${String(e)}`);
  }
};


// 标准化
export const normalizeContent = (content: Renderable): VNode  | string | null => {
  if (!content) return null;

  // 只调用真正的函数类型内容，排除组件
  if (isCallableContent(content)) {
    const result = content();
    return normalizeContent(result);
  }

  // 处理字符串
  if (typeof content === 'string') {
    return createVNode('span', null, content);
  }

  // 处理组件（函数式组件或普通组件）
  if (isVueComponent(content)) {
    return createVNode(content);
  }

  // VNode和JSX直接返回
  return content as VNode;
};
