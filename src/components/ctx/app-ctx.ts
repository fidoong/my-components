import { type AppContext, defineComponent, getCurrentInstance, onMounted } from 'vue';
let capturedAppContext: AppContext | null = null;

export const VueContextCapture = defineComponent({
  name: 'VueContextCapture',
  setup() {
    onMounted(() => {
      const instance = getCurrentInstance();
      if (instance) {
        capturedAppContext = instance.appContext;
      }
    });
    return () => null;
  }
});

export const useCapturedContext = (): AppContext => {
  if (!capturedAppContext) {
    throw new Error('获取app上下文失败');
  }
  return capturedAppContext;
};

