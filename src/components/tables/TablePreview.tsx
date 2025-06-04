import { renderCloumns } from '@/utils/utils';
import type { ParamsType } from '@ant-design/pro-provider';
import type { ProColumns, ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useCreation, useSetState } from 'ahooks';
import type { ColumnType } from 'antd/lib/table';
import { drop, keys } from 'lodash-es';

export default <T extends Record<string, any>, U extends ParamsType = ParamsType>(
  props: ProTableProps<T, U> & {
    convertObject?: boolean;
  },
) => {
  const [state, setState] = useSetState({
    columns: [] as ProColumns<T, 'text'>[],
    dataSource: [] as T[],
  });

  useCreation(() => {
    let dataSource = [...(props.dataSource || [])];
    let header = dataSource[0];
    if (props.convertObject && dataSource.length) {
      dataSource = drop(dataSource).map((arr) =>
        arr.reduce(
          (obj: Record<string, any>, item: string, index: number) => ({
            ...obj,
            [header[index]]: item,
          }),
          {},
        ),
      );
      // eslint-disable-next-line prefer-destructuring
      header = dataSource[0];
    }

    if ((props.columns || []).length || header) {
      const renderColumn = (obj: { title: string; dataIndex: string }): ColumnType<T> => ({
        ellipsis: true,
        ...obj,
      });
      setState({
        dataSource,
        columns: props.columns
          ? props.columns.map((o) => renderColumn(o))
          : keys(header).map((key) =>
              renderColumn({
                title: key,
                dataIndex: key,
              }),
            ),
      });
    } else {
      setState({
        dataSource,
        columns: [],
      });
    }
  }, [props.columns, props.dataSource]);

  return (
    <ProTable
      bordered
      search={false}
      pagination={false}
      options={false}
      scroll={state.columns.length > 5 ? { x: true } : undefined}
      size="small"
      {...props}
      columns={renderCloumns<T>(state.columns)}
      dataSource={state.dataSource}
    />
  );
};
