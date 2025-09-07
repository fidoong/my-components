import { ref, reactive, watch, type Ref, toValue } from 'vue';
import { type FormInstance, type FormRules } from 'element-plus';


// Hook配置选项
interface UseFormValidationOptions<T> {
  initialData: T;
  rules: FormRules;
  formRef: Ref<FormInstance | undefined>;
  beforeSubmit?: (data: T) => boolean | Promise<boolean>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// Hook返回值类型
interface UseFormValidationReturn<T> {
  formData: T;
  isSubmitting: Ref<boolean>;
  validate: () => Promise<boolean>;
  submit: () => Promise<void>;
  reset: () => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  getFieldValue: (field: keyof T) => T[keyof T];
}

export function useForm<T extends object>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const { initialData, formRef, beforeSubmit, onSuccess, onError } = options;

  // 表单数据
  const formData = reactive<T>({ ...initialData }) as T;
  const isSubmitting = ref(false);

  const validate = async (): Promise<boolean> => {
    if (!formRef.value) {
      console.warn('Form instance is not initialized');
      return false;
    }

    try {
      await formRef.value.validate();
      return true;
    } catch {
      return false;
    }
  };

  const submit = async (): Promise<void> => {
    if (isSubmitting.value) return;
    if (!formRef.value) {
      console.error('Form instance is required');
      return;
    }

    try {
      isSubmitting.value = true;

      if (beforeSubmit) {
        const canSubmit = await beforeSubmit({ ...toValue(formData) });
        if (!canSubmit) {
          isSubmitting.value = false;
          return;
        }
      }

      await formRef.value.validate();
      if (onSuccess) {
        onSuccess({ ...toValue(formData) });
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    } finally {
      isSubmitting.value = false;
    }
  };

  const reset = (): void => {
    if (!formRef.value) return;

    formRef.value.resetFields();
    // 关键修复：使用as断言明确键的类型兼容性
    Object.keys(initialData).forEach((key) => {
      formData[key as keyof T] = initialData[key as keyof T];
    });
  };

  const setFieldValue = (field: keyof T, value: T[keyof T]): void => {
    formData[field] = value;
  };

  const getFieldValue = (field: keyof T): T[keyof T] => {
    return formData[field];
  };

  watch(
    () => initialData,
    (newData) => {
      // 关键修复：使用as断言明确键的类型兼容性
      Object.keys(newData).forEach((key) => {
        formData[key as keyof T] = newData[key as keyof T];
      });
    },
    { deep: true }
  );

  return {
    formData,
    isSubmitting,
    validate,
    submit,
    reset,
    setFieldValue,
    getFieldValue
  };
}
