import { DragOutlined } from '@ant-design/icons';
import React from 'react';
import { useDrag } from 'react-dnd';
import classnames from 'classnames';
import styles from '@/components/DNDTitle.less';
import { Tabs, Tag, Space, Row, Col } from 'antd';

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
            style={{margin: '0 8px', cursor:'pointer'}}
        >
            <Tag>
                {props.node.name}
            </Tag>
        </div>
    );
};
