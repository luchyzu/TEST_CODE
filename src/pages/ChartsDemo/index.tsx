import { useCreation, useMount, usePersistFn, useSetState } from 'ahooks';
import type { EChartsOption, EChartsReactProps } from 'echarts-for-react';
import { Tabs, Tag, Space, Row, Col } from 'antd';
import Table from '@/components/tables/Table';

import styles from './index.less';
import BarChart from './components/BarChart';
import Dropkeyone from './components/Dropkeyone';
import Dropkeytwo from './components/Dropkeytwo';
import Dragtag from './components/dragtag';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useRef } from 'react';

interface RecordType {
    id: string;
    name: string;
    sex: string;
    city: string;
}
export default () => {
    const chartsref = useRef<any>();
    const chartsref2 = useRef<any>();

    const [state, setState] = useSetState({
        XItem: {} as Record<string, any>,
        YItem: {} as Record<string, any>,
        option: {} as EChartsOption,
        allkeys: [],
        keys: [],
        keys2: [],
        dataSource: [
            {
                name: '张三',
                city: '北京',
                id: '1',
                sex: '男'
            },
            {
                name: '李四',
                city: '北京',
                sex: '男',
                id: '2',
            },
            {
                name: '李四',
                city: '北京',
                sex: '女',
                id: '3',
            },
            {
                name: '李四',
                city: '上海',
                sex: '女',
                id: '4',
            },
        ],
        keyMap: [] as any[],
        i: 0,
        xAxis: [],
        series: [],
    });

    useMount(() => {
        const dataSource = state.dataSource
        let keyMap = [] as any[]
        Object.keys(dataSource[0]).forEach(key => {
            keyMap.push(key)
        })
        setState({
            keyMap
        })
    });

    const closeTag = (item) => {
        const keys = state.keys.filter(v => v.id !== item.id)
        setState({
            keys,
            i: state.i + 1
        })
    }

    const closeTag2 = (item) => {
        const keys2 = state.keys2.filter(v => v.id !== item.id)
        setState({
            keys2
        })
    }

    const filterData = (list, list2) => {
        let data1 = list.filter(v => v.newId === list[0].newId)
        let data2 = list.filter(v => v.newId !== list[0].newId)
        list2.push({
            name: list[0].newId,
            value: data1.length
        })
        if (data2.length) {
            filterData(data2, list2)
        }
        return list2
    }

    const getCharts = () => {
        let dataSource = state.dataSource
        const keys = state.keys.map(v => (v.id))
        dataSource.forEach(v => {
            let newId = ''
            let value = 0
            keys.forEach(vv => {
                newId += `${v[vv]}`
            })
            v['newId'] = newId
        })
        const list = filterData(dataSource, [])
        setState({
            xAxis: list.map(v => (v.name)),
            series: list.map(v => (v.value))
        })
    }

    const renderEcharts = usePersistFn((item) => {
        let keys = state.keys
        keys.push({
            id: item.data.id,
            name: item.data.name
        })
        setState({
            keys
        })
        getCharts()
    })

    const renderEcharts2 = usePersistFn((item) => {
        let keys2 = state.keys2
        keys2.push({
            id: item.data.id,
            name: item.data.name
        })
        setState({
            keys2
        })
    })

    const tableColumns: ProColumns<RecordType>[] = [
        {
            dataIndex: 'name',
            title: '名称',
        },
        {
            dataIndex: 'sex',
            title: '性别',
        },
        {
            dataIndex: 'city',
            title: '城市',
        },
    ];


    useCreation(() => {

    }, [state.keys]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div onClick={() => {
                console.log(chartsref, 'chartsref', chartsref2)
            }}>
                asdad
            </div>
            <div className={styles.root}>
                <div className={styles.keys}>
                    <Space size={[0, 8]} wrap>
                        {
                            state.keyMap.map(item => (
                                <Dragtag
                                    node={{ id: item, name: item }}
                                    dataIndex="columnName"
                                    dragType={'TITLE_COMPONENT'}
                                />
                            ))
                        }
                    </Space>
                </div>
                <Tabs>
                    <Tabs.TabPane tab="图" key="图" forceRender>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Dropkeyone
                                    accept={['DIMENSION_COMPONENT']}
                                    closeTag={closeTag}
                                    state={state}
                                    onDrop={renderEcharts}
                                />
                            </Col>
                            <Col span={12}>
                                <Dropkeytwo
                                    accept={['DIMENSION_COMPONENT']}
                                    closeTag={closeTag}
                                    state={state}
                                    onDrop={renderEcharts2}
                                />
                            </Col>
                        </Row>
                        <a style={{ display: 'none' }} ref={chartsref2} target="_blank" />,

                        <BarChart
                            data={{
                                xAxis: state.xAxis,
                                series: [
                                    {
                                        data: state.series,
                                        type: 'bar',
                                        name: '数据量',
                                    },
                                ],
                                ref: chartsref,
                            }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="数据" key="数据" forceRender>
                        <Table
                            headerTitle=" "
                            rowKey="id"
                            columns={tableColumns}
                            dataSource={state.dataSource}
                        />
                    </Tabs.TabPane>
                </Tabs>

            </div>
        </DndProvider>
    );
};
