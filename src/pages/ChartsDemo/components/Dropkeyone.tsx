import classnames from 'classnames';
import { useDrop } from 'react-dnd';
import styles from '../index.less';
import { Tag, Space, } from 'antd';

interface PropsType
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    accept: string[];
    onDrop?: (value: any) => void;
    closeTag: Function;
    state: Object;
}
export default (props: PropsType) => {
    const { accept, onDrop, ...divProps } = props;

    // 处理组件拖拽落下事件
    const [_, dropRef] = useDrop(
        {
            accept: ['TITLE_COMPONENT'],
            drop: (item: any) => {
                if (onDrop) onDrop(item);
            },
            collect: (monitor) => ({
            }),
        },
        [onDrop],
    );

    return (
        <div
            {...divProps}
            className={styles.cardBox}
            ref={dropRef}>
            <Space size={[0, 8]} wrap>
                {
                    props.state.keys.map(item => (
                        <Tag closable onClose={() => { props.closeTag(item) }}>
                            {item.name}
                        </Tag>
                    ))
                }
            </Space>
        </div>
    );
};
