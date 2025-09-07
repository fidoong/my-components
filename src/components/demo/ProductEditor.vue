<template>
  <div class="product-editor">
    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入产品名称" />
      </el-form-item>

      <el-form-item label="产品价格" prop="price">
        <el-input v-model.number="formData.price" type="number" placeholder="请输入价格" />
      </el-form-item>

      <el-form-item label="产品分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择分类">
          <el-option label="电子产品" value="electronic" />
          <el-option label="服装" value="clothing" />
          <el-option label="食品" value="food" />
        </el-select>
      </el-form-item>

      <el-form-item label="产品描述">
        <el-input v-model="formData.description" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, defineExpose, type ExtractPropTypes, reactive} from 'vue';
import { type FormInstance } from 'element-plus';
import {useForm} from "@/components/form/src/useForm.ts";
import {useFormRules} from "@/composables/form-rules";

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

const rules = useFormRules();
const formRules = reactive({
  name: rules.string.required().trigger('blur').build(),
})

const { formData, validate, submit, reset:resetForm }= useForm<Product>({
  initialData: props.initialData as Product,
  rules:{},
  formRef
})

// 获取表单数据
const getFormData = (): Product => {
  return { ...formData };
};


const submitForm = async () => {
  await submit()
}

defineExpose({
  validate,
  getFormData,
  resetForm,
  submitForm
});

</script>
