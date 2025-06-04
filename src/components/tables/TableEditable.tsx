import { typeMap } from '@/utils/constants';
import { randomId, renderCloumns } from '@/utils/utils';
import type { ParamsType } from '@ant-design/pro-provider';
import { EditableProTable } from '@ant-design/pro-table';
import type { EditableProTableProps } from '@ant-design/pro-table/lib/components/EditableTable';
import { useCreation, useSetState } from 'ahooks';
import { get, initial, last } from 'lodash-es';

import ButtonAsync from '../buttons/ButtonAsync';

export default function TableEditable<
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
>(props: EditableProTableProps<T, U> & { disabled?: boolean }) {
  const [state, setState] = useSetState({
    rowKey: '_randomId',
    value: [],
    columns: [],
  });

  useCreation(() => {
    setState({
      value:
        get(props.value, `[0].${state.rowKey}`) === undefined
          ? (props.value || []).map((o) => ({ ...o, [state.rowKey]: randomId() }))
          : props.value,
    });
  }, [props.value]);

  useCreation(() => {
    const lastColumn = last(props.columns);
    const isOptionColumn = lastColumn?.valueType === 'option';

    setState({
      columns: !isOptionColumn
        ? props.columns?.concat([
            {
              title: '操作',
              valueType: 'option',
              hideInTable: props.disabled,
              hideInSearch: props.disabled,
              render: (text, record, _, action) => [
                <ButtonAsync
                  key="editable"
                  type="link"
                  onClick={() => action?.startEditable?.(record[state.rowKey])}
                >
                  {typeMap.edit}
                </ButtonAsync>,
              ],
            },
          ])
        : initial(props.columns).concat([
            {
              ...lastColumn,
              hideInTable: props.disabled,
              hideInSearch: props.disabled,
            },
          ]),
    });
  }, [props.columns, props.disabled]);

  const tableProps: EditableProTableProps<T, U> = {
    rowKey: state.rowKey,
    toolBarRender: false,
    size: 'small',
    bordered: true,
    scroll: props.columns?.length > 5 ? { x: true } : undefined,
    ...props,
    value: state.value,
    columns: renderCloumns<T>(state.columns),
    recordCreatorProps:
      props.disabled || props.recordCreatorProps === false
        ? false
        : {
            creatorButtonText: '添加',
            // 顶部添加还是末尾添加
            // position: 'top',
            record: () => ({ [state.rowKey]: randomId() }),
            ...props.recordCreatorProps,
          },
  };

  return <EditableProTable {...tableProps} />;
}
