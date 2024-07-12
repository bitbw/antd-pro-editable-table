/* eslint-disable @typescript-eslint/no-explicit-any */
// Referece: https://ant.design/components/table-cn#components-table-demo-edit-cell
import React, {
  useContext,
  // useEffect, useRef, useState
} from "react";
import { Form, Table } from "antd";
import { ProTable } from "@ant-design/pro-components";
import {
  EditableCellProps,
  EditableContext,
  EditableRowProps,
  ToggleEditTableProps,
  defaultColumns,
  // getEditable,
  // getFromItemComponent,
  // getKey,
  // parseData,
} from "./helper";
// import Text from "@/components/Text";
// import { debounce } from "lodash";
import style from "./index.module.less";
import ToggleEditableCell from "../ToggleEditable/ToggleEditableCell";

// Row
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const { className } = props;
  const isExtandRow = (className as string).includes("ant-table-expanded-row");
  // tip: the index is undefined
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} key={index}>
      <EditableContext.Provider
        value={{ form: form, rowindex: index, isExtandRow }}
      >
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Cell
const EditableCell: React.FC<EditableCellProps> = (props) => {
  const { children } = props;
  const { form } = useContext(EditableContext);
  const newProps = { ...props, form: form };
  return (
    <ToggleEditableCell {...(newProps as any)} type="table">
      {children}
    </ToggleEditableCell>
  );
};

// Table
const ToggleEditTable: React.FC<ToggleEditTableProps> = ({
  dataSource,
  columns = defaultColumns,
  handleSave = () => 1,
  canEdit = true,
  tableType = "antdPro",
  ...props
}) => {
  // give onCell prop
  const newColumns = columns.map((col) => {
    if (!col.editable || !canEdit) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: number) => {
        return {
          record,
          rowindex: index,
          editable: col.editable,
          dataIndex: (col as any).dataIndex,
          valueType: (col as any).valueType,
          fieldProps: (col as any).fieldProps,
          formItemProps: (col as any).formItemProps,
          title: col.title,
          handleSave,
        };
      },
    };
  });

  return (
    <div className={`${style.toggleEditTable} toggle-edit-table`}>
      {tableType === "antdPro" ? (
        <ProTable
          {...props}
          rowClassName={() => "editable-row"}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          columns={newColumns as any}
        />
      ) : (
        <Table
          {...(props as any)}
          rowClassName={() => "editable-row"}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          columns={newColumns as any}
        />
      )}
    </div>
  );
};

export default ToggleEditTable;
