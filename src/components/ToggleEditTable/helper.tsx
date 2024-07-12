 
import dayjs from "dayjs";
import type { FormInstance, FormItemProps } from "antd/es/form";
import { ProTableProps } from "@ant-design/pro-components";
import {
  Input,
  InputProps,
  Select,
  SelectProps,
  Table,
  DatePicker,
  DatePickerProps,
  InputNumber,
  InputNumberProps,
} from "antd";
import React from "react";
import UserSelect, { UserSelectProps } from "@/components/UserSelect";
/**
 * ProFieldValueTypeWithFieldProps
 * 字段值类型与 ProFieldProps 的映射关系
 */
export type ProFieldValueTypeWithFieldProps = {
  /** 文本输入框 */
  text: InputProps;
  input: InputProps;
  option: Record<string, any>;

  /** 下拉选择器 */
  select: SelectProps;
  date: DatePickerProps;
  userSelect: UserSelectProps;
  digit: InputNumberProps;
};

export type ProFieldValueType = Extract<
  keyof ProFieldValueTypeWithFieldProps,
  any
>;

export const EditableContext = React.createContext<{
  form: FormInstance<any> | null;
  rowindex: number; // can't get index
  isExtandRow?: boolean;
}>({ form: null, rowindex: 0 });

export type EditableCellProps = {
  title?: React.ReactNode;
  editable?: boolean | ((...args: any) => boolean);
  children: React.ReactNode;
  dataIndex: string | string[];
  record: any;
  handleSave?: (...args: any) => void;
  valueType?: ProFieldValueType;
  fieldProps?: ProFieldValueTypeWithFieldProps[ProFieldValueType];
  formItemProps?: FormItemProps;
  rowindex?: number;
  form?: FormInstance<any>;
  type?: string;
  parseData?: (...args: any) => any;
};

export interface EditableRowProps {
  index: number;
  className: any;
  children: React.ReactNode;
}

export type ToggleEditTableProps = ProTableProps<any, any> & {
  handleSave: (...args: any) => any;
  columns: EditableColProps[];
  canEdit?: boolean;
  tableType?: "antdPro" | "antd";
};

export type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export type EditableColProps = ColumnTypes[number] &
  Pick<
    EditableCellProps,
    "fieldProps" | "handleSave" | "editable" | "valueType"
  >;

export const defaultColumns: EditableColProps[] = [
  {
    title: "name",
    dataIndex: "name",
    width: "30%",
    editable: true,
    valueType: "input",
  },
  {
    title: "age",
    dataIndex: "age",
    valueType: "select",
    editable: true,
    fieldProps: {
      options: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
      ],
    },
  },
  {
    title: "address",
    dataIndex: "address",
  },
  {
    title: "operation",
    dataIndex: "operation",
  },
];

export const getFromItemComponent = (props = {} as any) => {
  const { valueType, itemRef, save, fieldProps, saveDebounce } = props;
  let item = <></>;
  switch (valueType) {
    case "input":
    case "text":
      item = (
        <Input
          ref={itemRef}
          onPressEnter={save}
          onBlur={save}
          {...(fieldProps as InputProps)}
        />
      );
      break;
    case "digit":
      item = (
        <InputNumber
          ref={itemRef}
          onPressEnter={save}
          onBlur={save}
          {...(fieldProps as InputNumberProps)}
        />
      );
      break;
    case "select":
      item = (
        <Select ref={itemRef} onBlur={save} {...(fieldProps as SelectProps)} />
      );
      break;
    case "date":
      item = (
        <DatePicker
          ref={itemRef}
          onBlur={() => {
            saveDebounce();
          }}
          {...(fieldProps as DatePickerProps)}
        />
      );
      break;
    case "userSelect":
      item = (
        <UserSelect
          showSearch
          placeholder="请选择人员"
          ref={itemRef as any}
          onBlur={save}
          {...(fieldProps as UserSelectProps)}
        />
      );
      break;
    default:
      item = (
        <Input
          ref={itemRef}
          onPressEnter={save}
          onBlur={save}
          {...(fieldProps as InputProps)}
        />
      );
      break;
  }
  return item;
};

export const getEditable = (
  editable: EditableCellProps["editable"],
  ...args: any[]
) => {
  // console.log(props)
  if (typeof editable === "function") {
    return editable(...args);
  }
  return editable;
};

export const parseData = (props: EditableCellProps) => {
  const { dataIndex, record, valueType = "input" } = props;
  let value: any = "";
  const key = getKey(dataIndex);
  if (Array.isArray(dataIndex)) {
    // exmaple : dataIndex: ["DRE", "domainAccount"], 根据 data index 查找 record 对应的 value
    value = dataIndex.reduce((acc, cur) => {
      return acc[cur];
    }, record);
  } else {
    value = record[dataIndex];
  }
  switch (valueType) {
    case "date":
      value = value ? dayjs(value) : null;
      break;
    // case "user":
    //   break;
    default:
      break;
  }

  return { [key]: value };
};

export const getKey = (dataIndex: EditableCellProps["dataIndex"]) => {
  return Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex;
};
export const getNewTableDataByToggleEditTable = ({
  newData,
  tableData,
  dataKey = "id",
}: {
  tableData: any[];
  newData: any;
  dataKey?: string;
}) => {
  const newTabaleData = tableData.map((item) => {
    if (item[dataKey] === newData[dataKey]) {
      const newItem = { ...item };
      for (const key in newData) {
        const newValue = newData[key];
        const keys = key.split(".");
        keys.reduce((obj, key, index) => {
          if (index === keys.length - 1) {
            obj[key] = newValue;
            return;
          }
          return obj[key];
        }, newItem);
      }
      return newItem;
    } else {
      return item;
    }
  });
  return newTabaleData;
};
export const getNewTableDataByToggleEditTableDeep = ({
  newData,
  tableData,
  dataKey = "id",
}: {
  tableData: any[];
  newData: any;
  dataKey?: string;
}) => {
  const newTabaleData = tableData.map((item) => {
    if (item[dataKey] === newData[dataKey]) {
      const newItem = { ...item };
      for (const key in newData) {
        const newValue = newData[key];
        const keys = key.split(".");
        keys.reduce((obj, key, index) => {
          if (index === keys.length - 1) {
            obj[key] = newValue;
            return;
          }
          return obj[key];
        }, newItem);
      }
      return newItem;
    } else {
      if (item.children && item.children.length > 0) {
        item.children = getNewTableDataByToggleEditTableDeep({
          newData,
          tableData: item.children,
          dataKey,
        });
      }
      return item;
    }
  });
  return newTabaleData;
};
