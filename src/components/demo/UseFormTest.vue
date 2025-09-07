<template>
  <el-card title="用户注册" class="registration-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      size="default"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱地址" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="formData.age" placeholder="请输入年龄" />
      </el-form-item>

      <el-form-item label="身高(米)" prop="height">
        <el-input v-model="formData.height" placeholder="请输入身高，保留两位小数" />
      </el-form-item>

      <el-form-item label="设置密码" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请设置密码" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">注册</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance } from 'element-plus';
import {useFormRules} from "@/components/form/src/useFormRules.ts";
import {useForm} from "@/components/form/src/useForm.ts";

// 表单引用
const formRef = ref<FormInstance>();
// 表单规则
const rules = useFormRules();
const formRules = reactive({
  // 使用快捷规则
  username: rules.username()
    .trigger('blur')
    .build(),

  // 使用邮箱快捷规则
  email: rules.email()
    .trigger('blur')
    .build(),

  // 使用手机号快捷规则
  phone: rules.phone()
    .trigger('blur')
    .build(),

  // 使用数字规则
  age: rules.number
    .required('年龄不能为空')
    .and()
    .positiveInteger('年龄必须是正整数')
    .and()
    .range(18, 120, '年龄必须在18-120岁之间')
    .trigger('blur')
    .build(),

  // 组合数字规则
  height: rules.combine(
    rules.number
      .required('身高不能为空')
      .and()
      .decimal(2, '身高最多保留两位小数'),
    rules.number
      .range(1.0, 2.5, '身高范围应在1.0-2.5米之间')
  )
    .trigger('blur')
    .build(),

  // 使用密码规则
  password: rules.password
    .required('密码不能为空')
    .and()
    .weak(8, '密码长度不能少于8位')
    .and()
    .trigger('blur')
    .build(),

  // 密码确认规则
  confirmPassword: rules.password
    .required('请确认密码')
    .and()
    .trigger('blur')
    .build()
});
// 初始数据
const initialData = {
  username: '',
  email: '',
  phone: '',
  age: '',
  height: '',
  password: '',
  confirmPassword: ''
}

export type UserType = typeof initialData;

const {
  isSubmitting,
  formData,
  submit,
  reset,
} = useForm<UserType>({
  initialData,
  rules: formRules,
  formRef
})

const handleSubmit = () => {
  submit().then(res => {
    console.log(res)
  })
}

</script>

<style scoped>
.registration-form {
  max-width: 700px;
  margin: 30px auto;
  padding: 20px;
}
</style>
