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

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">注册</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import {useFormRules} from "@/components/form/src/useFormRules.ts";

// 创建规则容器实例
const rules = useFormRules();

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  phone: '',
  age: null as number | null,
  height: null as number | null,
  password: '',
  confirmPassword: ''
});

// 表单引用
const formRef = ref<FormInstance>();

// 定义表单验证规则
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
    .strong('密码必须包含大小写字母、数字和特殊字符')
    .trigger('blur')
    .build(),

  // 密码确认规则
  confirmPassword: rules.password
    .required('请确认密码')
    .and()
    .confirm(formData.password)
    .trigger('blur')
    .build()
});

// 监听密码变化，更新确认密码验证
watch(
  () => formData.password,
  () => {
    if (formRef.value) {
      formRef.value.validateField('confirmPassword');
    }
  }
);

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    console.log('表单验证通过，提交数据:', formData);
    ElMessage.success('注册成功！');
  } catch (error) {
    console.log('表单验证失败:', error);
    ElMessage.error('请检查并修正表单中的错误');
  }
};

// 重置表单
const handleReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};
</script>

<style scoped>
.registration-form {
  max-width: 700px;
  margin: 30px auto;
  padding: 20px;
}
</style>
