import {
  type AppContext,
  type ComponentPublicInstance,
  type VNode,
  createVNode,
  markRaw,
  reactive,
  ref,
  shallowRef,
} from 'vue';
import {ElButton, ElDialog} from 'element-plus';
import {useCapturedContext} from "@/components/ctx/app-ctx.ts";
import type {
  ModalOptions,
  Renderable,
  RenderType,
  UseModalReturn
} from "@/components/modal/src/type.ts";
import {
  createContainer,
  getAppContext,
  isVueComponent,
  normalizeContent,
  safeRender
} from "@/components/modal/src/utils.ts";


export function useModal<T = ComponentPublicInstance, P = Record<string, unknown>>(
  defaultOptions: ModalOptions,
  ctx?: AppContext,
): UseModalReturn<T, P> {

  const appContext = getAppContext() || ctx;

  const defaultConfig: ModalOptions = {
    width: '50%',
    showClose: true,
    confirmText: '确认',
    cancelText: '取消',
    showConfirmButton: true,
    showCancelButton: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    useDefaultFooter: true,
    useDefaultHeader: true,
    inheritContext: true,
    customClass: '',
    appendToBody: true,
    ...defaultOptions,
    content: isVueComponent(defaultOptions?.content) ? markRaw(defaultOptions?.content) : null,
    header: isVueComponent(defaultOptions?.header) ? markRaw(defaultOptions?.header) : null,
    footer: isVueComponent(defaultOptions?.footer) ? markRaw(defaultOptions?.footer) : null,
  };

  const visible = ref(false);

  const options = reactive<ModalOptions>({...defaultConfig});

  const footerButtonProps = reactive({
    loading: false,
  })
  const customRender = shallowRef<Partial<RenderType>>({
    renderHeader: options.header,
    renderContent: options.content,
    renderFooter: options.footer
  })

  const componentRef = ref();
  const componentProps = ref<P>();
  const vnodeRef = ref<VNode | null>(null);
  const containerRef = ref<HTMLElement | null>(null);

  const confirmCallback = ref<(() => Promise<unknown> | void) | null>(null);
  const cancelCallback = ref<(() => Promise<unknown> | void) | null>(null);
  const beforeCloseCallback = ref<((done: () => void) => void) | null>(null);

  const cleanup = () => {
    if (containerRef.value?.parentElement) {
      safeRender(null, containerRef.value);
      containerRef.value.parentElement.removeChild(containerRef.value);
    }
    containerRef.value = null;
    vnodeRef.value = null;
  };

  const renderDefaultFooter = () => {
    const buttons: VNode[] = [];
    if (options.showCancelButton) {
      buttons.push(
        createVNode(ElButton, {
          onClick: handleCancel,
          disabled: footerButtonProps.loading
        }, {
          default: () => options.cancelText
        })
      );
    }

    if (options.showConfirmButton) {
      buttons.push(
        createVNode(ElButton, {
          type: 'primary',
          onClick: handleConfirm,
          loading: footerButtonProps.loading
        }, {
          default: () => options.confirmText
        })
      );
    }

    return buttons;
  };

  const renderHeader = () => {
    if (!options.useDefaultHeader && customRender.value.renderHeader) {
      return normalizeContent(customRender.value.renderHeader);
    }
    return normalizeContent(options.title);
  };
  const renderFooter = () => {
    if (!options.useDefaultFooter && customRender.value.renderHeader) {
      return normalizeContent(customRender.value.renderHeader);
    }
    return renderDefaultFooter();
  };
  const renderContent = () => {
    if (!customRender.value.renderContent) return null;
    if (isVueComponent(options.content)) {
      const Component = customRender.value.renderContent;
      return createVNode(Component, {
        ...componentProps.value,
        ref: (el) => {
          componentRef.value = el
        },
        onClose: close,
        onConfirm: handleConfirm
      });
    } else {
      return normalizeContent(customRender.value.renderContent);
    }

  };
  const renderModal = () => {
    if (!containerRef.value) {
      containerRef.value = createContainer(options?.appendToBody);
    }

    if (vnodeRef.value && containerRef.value) {
      safeRender(null, containerRef.value);
    }

    const dialogVNode = createVNode(ElDialog, {
      ...options,
      modelValue: visible.value,
      'onUpdate:modelValue': (val: boolean) => {
        visible.value = val;
        if (!val && containerRef.value) {
          safeRender(null, containerRef.value);
          cleanup();
        }
      },
      beforeClose: handleBeforeClose,
      class: ['custom-modal', options.customClass].filter(Boolean).join(' ')
    }, {
      header: renderHeader,
      default: renderContent,
      footer: renderFooter
    });

    if (options.inheritContext && appContext) {
      dialogVNode.appContext = appContext;
    }

    vnodeRef.value = dialogVNode;

    if (containerRef.value) {
      safeRender(dialogVNode, containerRef.value);
    }
  };

  const handleConfirm = async () => {
    if (confirmCallback.value) {
      try {
        footerButtonProps.loading = true;
        await confirmCallback.value();
        footerButtonProps.loading = false;
        close();
      } catch (error) {
        footerButtonProps.loading = false;
        throw error;
      }
    } else {
      close();
    }
  };

  const handleCancel = async () => {
    if (cancelCallback.value) {
      try {
        await cancelCallback.value();
        close();
      } catch (error) {
        throw error;
      }
    } else {
      close();
    }
  };

  const handleBeforeClose = (done: () => void) => {
    if (beforeCloseCallback.value) {
      beforeCloseCallback.value(done);
    } else {
      done();
    }
  };

  const open = (customOptions?: Partial<ModalOptions>, props?: P) => {
    if (customOptions) {
      Object.assign(options, customOptions);
    }
    if (props) {
      componentProps.value = props;
    }
    visible.value = true;
    renderModal();
  };

  const close = () => {
    visible.value = false;
    if (containerRef.value && vnodeRef.value) {
      safeRender(null, containerRef.value);
      cleanup();
    }
  };

  const toggle = (customOptions?: Partial<ModalOptions>, props?: P) => {
    if (visible.value) {
      close();
    } else {
      open(customOptions, props)
    }
  };

  const destroy = () => {
    close();
    cleanup();
  };

  const onConfirm = (callback: () => Promise<unknown> | void) => {
    confirmCallback.value = callback;
  };

  const onCancel = (callback: () => Promise<unknown> | void) => {
    cancelCallback.value = callback;
  };

  const onBeforeClose = (callback: (done: () => void) => void) => {
    beforeCloseCallback.value = callback;
  };

  const setHeader = (header: Renderable) => {
    options.useDefaultHeader = false;
    customRender.value.renderHeader = header;
  };

  const setFooter = (footer: Renderable) => {
    options.useDefaultFooter = false;
    customRender.value.renderFooter = footer;
  };

  const setContent = (content: Renderable) => {
    customRender.value.renderContent = content;
  };

  return {
    visible,
    options,
    componentRef,
    open,
    close,
    toggle,
    onConfirm,
    onCancel,
    onBeforeClose,
    setHeader,
    setFooter,
    setContent,
    destroy
  };
}

export const getModel = <T, P>(option: ModalOptions) => {

  const appContext = useCapturedContext();

  return useModal<T, P>(
    option,
    appContext
  );
};
