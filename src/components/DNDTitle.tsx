import { DragOutlined } from '@ant-design/icons';
import React from 'react';
import { useDrag } from 'react-dnd';
import classnames from 'classnames';
import styles from './DNDTitle.less';

interface PropsType {
  node: any;
  dataIndex?: string;
  dragType: string;
  disabled?: boolean;
}

export default (props: PropsType) => {
  const { node = {}, dataIndex = 'title' } = props;

  const [, dragRef] = useDrag(
    {
      item: { type: props.dragType, data: props.node },
      // collect: (monitor) => ({
      //   isDragging: !!monitor.isDragging(),
      // }),
    },
    [],
  );

  return (
    <div
      className={classnames(styles.nodeTitleWrapper, { disabled: props.disabled })}
      ref={dragRef}
    >
      <div className={styles.node}>
        <DragOutlined className={styles.nodeIcon} />
        <div className={styles.label}>{node[dataIndex] || ''}</div>
      </div>
    </div>
  );
};
