import {
  defineComponent,
  ref,
  watch,
  onMounted,
  type PropType, useModel,
} from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElMessage, type TableProps, type TableInstance
} from 'element-plus';

import type {
  TableColumnConfig,
  FetchParams,
  FetchApi, TableConfig,
  BaseTableProxy
} from './type.ts';
import type {DefaultRow} from "element-plus/es/components/table/src/table/defaults";



const BaseTable = defineComponent(
  {
    name: 'BaseTable',
    props: {
      modelValue: {
        type: Array as PropType<DefaultRow[]>,
        default: undefined
      },
      queryParams: {
        type: Object as PropType<FetchParams>,
        default: () => ({})
      },
      total: {
        type: Number,
        default: 0
      },
      fetchApi: {
        type: Object as PropType<FetchApi<DefaultRow>>,
        default: undefined
      },
      config: {
        type: Object as PropType<TableConfig>,
        required: true
      },
      tableProps: {
        type: Object as PropType<Partial<TableProps<DefaultRow>>>,
        default: () => ({})
      },

    },

    emits: [
      'update:modelValue',
      'update:queryParams',
      'update:total',
      'pagination-change',
      'row-click',
      'fetch-error'],

    setup(props, ctx) {

      const tableRef = ref<TableInstance | null>(null);

      const loading = ref(false);

      const data = useModel(props, 'modelValue');

      const queryParams = useModel(props, 'queryParams');

      const total = useModel(props,'total')

      const fetchData = async () => {
        if (!props.fetchApi) return;

        loading.value = true;
        try {
          const params: FetchParams = {
            ...queryParams.value,
          };

          const response = await props.fetchApi(params);
          data.value = response.list;
          total.value = response.total;

        } catch (error) {
          ctx.emit('fetch-error', error);
          ElMessage.error(`获取数据失败: ${String(error)}`);
        } finally {
          loading.value = false;
        }
      };

      const reLoadData = async () => {
        queryParams.value = {
          ...queryParams.value,
          pageNum: 1,
        }
       await fetchData()
      }
      const handlePaginationChange = async (pageNum: number, pageSize: number) => {
        if (pageNum < 1) pageNum = 1;
        if (pageSize < 1) pageSize = queryParams.value?.pageSize || 1;

        queryParams.value = {
          ...queryParams.value,
          pageNum,
          pageSize
        };

        ctx.emit('pagination-change', {pageNum, pageSize});
       await fetchData();
      };

      // 监听fetchApi变化
      watch(
        () => props.fetchApi,
        async () => {
         await reLoadData();
        }
      );


      const handleSizeChange = () => {
        console.log('handleSizeChange', handleSizeChange)
      }

      // 递归渲染列
      const renderColumns = (columns: TableColumnConfig[]) => {
        // 避免空数组渲染
        if (!columns || columns.length === 0) return null;

        return columns.map((column, index) => {
          // 生成唯一key
          const key = column.prop || `column-${index}`;

          // 如果有children，递归渲染子列
          if (column.children && column.children.length > 0) {
            return (
              <ElTableColumn
                key={key}
                {...column}
              >
                {renderColumns(column.children)}
              </ElTableColumn>
            );
          }

          // 处理自定义渲染函数
          if (column.render) {
            return (
              <ElTableColumn
                key={key}
                {...column}
                v-slots={{
                  default: column.render,
                }}
              />
            );
          }

          // 普通列
          return (
            <ElTableColumn
              key={key}
              {...column}
            />
          );
        });
      };

      const createTableProxy = (): BaseTableProxy => {
        const _exposed = {
          reLoadData,
        } as BaseTableProxy

        if (!tableRef.value) {
          return _exposed;
        }

        const tableInstance = tableRef.value;

        return new Proxy(_exposed, {
          get(target, propKey: string | symbol) {
            // 1. 优先获取组件自身方法
            if (Reflect.has(target, propKey)) {
              return Reflect.get(target, propKey);
            }

            // 2. 自身没有时，再取ElTable实例方法
            if (Reflect.has(tableInstance, propKey)) {
              const value = Reflect.get(tableInstance, propKey);
              return typeof value === 'function'
                ? (...args: unknown[]) => value.apply(tableInstance, args)
                : value;
            }

            return undefined;
          }
        });
      };


      ctx.expose(createTableProxy());

      onMounted(async ()=> {
        await reLoadData()
      })

      return () => {
        return (
          <div class="base-table-container">
            <ElTable
              ref={(el) => tableRef.value = el as TableInstance}
              {...props.tableProps}
              data={data.value}
            >
              {renderColumns(props.config.columns)}
            </ElTable>

            {props.config.pagination?.enabled && (
              <div class="base-table-pagination">
                <ElPagination
                  total={total.value}
                  pageSizes={props.config.pagination?.pageSizes || [10, 20, 50, 100]}
                  layout={props.config.pagination?.layout || 'total, sizes, prev, pager, next, jumper'}
                  {...props.config.pagination}
                  on-Size-change={handleSizeChange}
                  on-Current-change={handlePaginationChange}
                />
              </div>
            )}
          </div>
        )
      }
    }
  }
)

export default BaseTable;
