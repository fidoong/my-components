import type {Component, Ref, VNode} from "vue";
import type {DialogProps} from "element-plus";

export type Renderable =
  | string
  | VNode
  | Component
  | (() => Renderable)
  | null
  | undefined;

export type RenderType = {
  renderHeader: Renderable,
  renderContent: Renderable,
  renderFooter: Renderable
}

export type CallableContent = () => VNode | string;

export type ModalOptions = Partial<DialogProps> & {
  idx: symbol;
  title: string;
  content?: Renderable,
  footer?: Renderable,
  header?: Renderable
  showClose?: boolean;
  confirmText?: string;
  cancelText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  useDefaultFooter?: boolean;
  useDefaultHeader?: boolean;
  inheritContext?: boolean;
  customClass?: string;
  appendToBody?: boolean;
}


export interface UseModalReturn<T = unknown, P = Record<string, unknown>> {
  visible: Ref<boolean>;
  options: ModalOptions;
  componentRef: Ref<T | null>;
  open: (options?: Partial<ModalOptions>, props?: P) => void;
  close: () => void;
  toggle: (options?: Partial<ModalOptions>, props?: P) => void;
  onConfirm: (callback: () => Promise<unknown> | void) => void;
  onCancel: (callback: () => Promise<unknown> | void) => void;
  onBeforeClose: (callback: (done: () => void) => void) => void;
  setHeader: (header: Renderable) => void;
  setFooter: (footer: Renderable) => void;
  setContent: (content: Renderable) => void;
  destroy: () => void;
}
