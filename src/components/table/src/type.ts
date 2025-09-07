import type {
  TableColumnCtx, TableProps,
  PaginationProps, TableInstance,
} from "element-plus";
import type {DefaultRow} from "element-plus/es/components/table/src/table/defaults";
import type {VNode} from "vue";

export interface PaginationInfo {
  pageNum: number;
  pageSize: number;
  total: number;
}

export type TableColumnConfig<T extends DefaultRow = DefaultRow> = Partial<TableColumnCtx> & {
  prop?: keyof T;
  render?: (...arg: any[]) => VNode | VNode[] | string | null;
  children?: TableColumnConfig<T>[];
} ;


export interface TableConfig<T extends DefaultRow = DefaultRow> {
  columns: TableColumnConfig<T>[];
  pagination?: Partial<PaginationProps> & {
    enabled: boolean;
    pageSizes?: number[];
    layout?: string;
  };
}

export interface FetchParams {
  pageNum: number;
  pageSize: number;
  params: Record<string, unknown>;
}

export type FetchApi<T> = (params: FetchParams) => Promise<{
  list: T[];
  total: number;
}>


export type BaseTableProxy = {
  reLoadData: () => Promise<void>;
} & TableInstance;
