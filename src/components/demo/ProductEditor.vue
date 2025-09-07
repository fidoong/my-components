<template>
  <div class="product-editor">
    <el-form :model="form" ref="formRef" label-width="100px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入产品名称" />
      </el-form-item>

      <el-form-item label="产品价格" prop="price">
        <el-input v-model.number="form.price" type="number" placeholder="请输入价格" />
      </el-form-item>

      <el-form-item label="产品分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option label="电子产品" value="electronic" />
          <el-option label="服装" value="clothing" />
          <el-option label="食品" value="food" />
        </el-select>
      </el-form-item>

      <el-form-item label="产品描述">
        <el-input v-model="form.description" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, defineProps, defineExpose, type ExtractPropTypes} from 'vue';
import { type FormInstance } from 'element-plus';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const props = defineProps<{
  initialData?: Partial<Product>;
}>();

export type ProductEditorProps = ExtractPropTypes<typeof props>

const formRef = ref<FormInstance>();

// 表单数据
const form = reactive<Product>({
  name: '',
  price: 0,
  category: '',
  description: '',
  ...props.initialData
});


// 验证表单
const validate = async () => {
  if (!formRef.value) return false;
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
};

// 获取表单数据
const getFormData = (): Product => {
  return { ...form };
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const submitForm = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(formRef.value);
    },3000)
  })
}

defineExpose({
  validate,
  getFormData,
  resetForm,
  submitForm
});
</script>
