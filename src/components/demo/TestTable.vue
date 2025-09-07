<template>
  <UseFormTest/>
  <br/>
  <div class="table-demo-container">
    <div class="query-form">
      <el-input
        v-model="queryParams.params.name"
        placeholder="请输入名称"
        style="width: 200px; margin-right: 10px;"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
    <base-table
      ref="tableRef"
      :fetch-api="fetchTableData"
      v-model="tableData"
      v-model:queryParams="queryParams"
      :config="{
        columns,
        pagination: {
          enabled: true,
        }
      }"
      :table-props="{
        maxHeight: '400px'
      }"
    />
  </div>
</template>

<script setup lang="tsx">
import {ref} from 'vue';
import BaseTable from "@/components/table/src/BaseTable.tsx";
import {ElMessage, ElTag, ElButton} from 'element-plus';
import type {BaseTableProxy, FetchParams, TableColumnConfig} from "@/components/table/src/type.ts";
import {useProductEditorModal} from "@/components/demo/productModal.ts";
import UseFormTest from "@/components/demo/UseFormTest.vue";

// 表格数据类型定义
interface TableItem {
  id: number;
  name: string;
  status: number;
  createTime: string;
  operator: string;
}
const productModal = useProductEditorModal();

const queryParams = ref<FetchParams>({
  pageNum: 1,
  pageSize:10,
  params: {
    name: '',
    status: undefined
  }
});

const tableData = ref([])
const columns = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    align: 'center'
  },
  {
    prop: 'name',
    label: '名称',
    minWidth: 150
  },
  {
    prop: 'status',
    label: '状态',
    width: 120,
    align: 'center',
    render: (row: TableItem) => {
      return row.status === 1
        ? <ElTag type="success">启用</ElTag>
        : <ElTag type="danger">禁用</ElTag>;
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    align: 'center'
  },
  {
    prop: 'operator',
    label: '操作人',
    width: 120
  },
  {
    label: '操作',
    width: 200,
    align: 'center',
    render: (row: TableItem) => {
      return (
        <div class="operation-buttons">
          <ElButton
            size="small"
            type="primary"
            onClick={() => handleEdit(row)}
          >
            编辑
          </ElButton>
          <ElButton
            size="small"
            type="danger"
            onClick={() => handleDelete(row.id)}
          >
            删除
          </ElButton>
        </div>
      )
        ;
    }
  }
] as TableColumnConfig[]

const tableRef = ref<BaseTableProxy | null>(null);

// 模拟API请求函数
const fetchTableData = async (params: FetchParams) => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟返回数据
  const {pageNum, pageSize} = params;
  const total = 58; // 模拟总条数

  // 生成模拟数据
  const list: TableItem[] = Array.from({length: pageSize}, (_, i) => {
    const index = (pageNum - 1) * pageSize + i + 1;
    return {
      id: index,
      name: `测试数据 ${index}`,
      status: index % 3 === 0 ? 0 : 1,
      createTime: `2023-0${Math.floor(index / 10) + 1}-${index % 28 + 1} 10:00:00`,
      operator: `用户${index % 5 + 1}`
    };
  }).filter(item => item.id <= total);

  return {
    list,
    total
  };
};

// 搜索事件
const handleSearch = () => {
  tableRef.value?.reLoadData();
};

// 重置事件
const handleReset = () => {
  tableRef.value?.reLoadData();
};



// 编辑事件
const handleEdit = (row: TableItem) => {
  console.log('编辑:', row);
  ElMessage.success(`准备编辑ID为 ${row} 的记录`);
  productModal.open();
};

// 删除事件
const handleDelete = (id: number) => {
  console.log('删除ID:', id);
  ElMessage.warning(`确认删除ID为 ${id} 的记录`);
  // 实际项目中这里会调用删除接口，然后刷新表格
  // tableRef.value?.refresh();
};

</script>

<style scoped>

.query-form {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.operation-buttons {
  display: flex;
  justify-content: center;
}
</style>
