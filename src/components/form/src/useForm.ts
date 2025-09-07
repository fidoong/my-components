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
  submit: () => Promise<T>; // 修改为返回Promise<T>
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
      throw new Error('Form instance is not initialized');
    }

    try {
      await formRef.value.validate();
      return true;
    } catch {
      return false;
    }
  };

  // 修改submit为返回Promise<T>
  const submit = async (): Promise<T> => {
    if (isSubmitting.value) {
      throw new Error('Form is already submitting');
    }
    if (!formRef.value) {
      throw new Error('Form instance is required');
    }

    try {
      isSubmitting.value = true;
      const formValue = { ...toValue(formData) };

      // 执行前置提交检查
      if (beforeSubmit) {
        const canSubmit = await beforeSubmit(formValue);
        if (!canSubmit) {
          throw new Error('Submit prevented by beforeSubmit');
        }
      }

      // 执行表单验证
      await formRef.value.validate();

      // 触发成功回调
      if (onSuccess) {
        onSuccess(formValue);
      }

      // 返回表单数据
      return formValue;
    } catch (error) {
      // 触发错误回调
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      // 重新抛出错误供Promise捕获
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  const reset = (): void => {
    if (!formRef.value) return;
    formRef.value.resetFields();
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
