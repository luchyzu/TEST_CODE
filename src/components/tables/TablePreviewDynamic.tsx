import { renderCloumns } from '@/utils/utils';
import type { ProColumns } from '@ant-design/pro-table';
import { useMount } from 'ahooks';
import { useState } from 'react';
import TablePreview from './TablePreview';

export default <T,>(props: {
  data?: {
    keys?: string[];
    values?: Record<string, any>;
  };
}) => {
  const [columns, setColumns] = useState<ProColumns<T, 'text'>[]>([]);
  const [dataSource, setDataSource] = useState([]);

  useMount(() => {
    if (props?.data?.keys) {
      const newColumns = props.data.keys.map((item) => {
        return {
          title: item,
          dataIndex: item,
        } as Record<string, any>;
      });
      setColumns(newColumns);
    }
    if (props?.data?.values) {
      const newDataSoure = props?.data?.values.map((item) => {
        if (!item) {
          const newObject = {};
          (props?.data?.keys || []).forEach((v) => {
            newObject[v] = 'null';
          });
          return newObject;
        }
        return item;
      });
      setDataSource(newDataSoure);
    }
  });
  return <TablePreview columns={renderCloumns<T>(columns)} dataSource={dataSource} />;
};
