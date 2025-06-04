// import { renderCloumns } from '@/utils/utils';
import type { ParamsType } from '@ant-design/pro-provider';
import type { ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useCreation, usePersistFn } from 'ahooks';
import classNames from 'classnames';
import styles from './style.less';

export default function Table<T extends Record<string, any>, U extends ParamsType = ParamsType>(
  props: ProTableProps<T, U> & {
    headerBarLeft?: React.ReactNode;
    unScroll?: boolean;
  },
) {
  const {
    headerBarLeft,
    options,
    rowSelection,
    className,
    columns = [],
    unScroll = false,
    ...otherProps
  } = props;

  const isFixed = useCreation(() => columns.length > 5, [columns]);

  const renderProps = usePersistFn(
    (): ProTableProps<T, U> => ({
      bordered: true,
      rowKey: 'id',
      dateFormatter: 'string',
      size: 'small',
      pagination: {
        defaultPageSize: 10,
      },
      scroll: isFixed && !unScroll ? { x: true } : undefined,
      ...otherProps,
      columns,
      // columns: renderCloumns<T>(
      //   isFixed
      //     ? columns.map((o, i) => ({
      //         fixed: i === 0 ? 'left' : i === columns.length - 1 ? 'right' : undefined,
      //         ...o,
      //       }))
      //     : columns,
      // ),
      rowSelection: rowSelection ? { preserveSelectedRowKeys: true, ...rowSelection } : undefined,
      options:
        options === false
          ? options
          : {
              density: false,
              fullScreen: false,
              ...options,
            },
      toolBarRender: headerBarLeft
        ? () => [
            <div key="barLeft" className={styles.barLeft}>
              {headerBarLeft}
            </div>,
            ...(props.toolBarRender?.() ?? []),
          ]
        : props.toolBarRender,
      className: classNames(className, { [styles.pagination]: otherProps.pagination === false }),
    }),
  );
  return (
    // <ConfigProvider
    //   getPopupContainer={(node) => {
    //     console.log({node})
    //     if (node) {
    //       return document.getElementById("ant-design-pro-table");
    //     }
    //     return document.body;
    //   }}
    // >
    <ProTable {...renderProps()} />
    // </ConfigProvider>
  );
}
