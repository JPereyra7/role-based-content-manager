import { ColumnDef } from "@tanstack/react-table";

export interface IColumnProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  }