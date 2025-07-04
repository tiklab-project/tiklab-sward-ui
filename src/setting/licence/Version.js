import React, { Fragment } from "react";
import { Version } from 'tiklab-licence-ui';
import { Table,Icon } from "antd";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
const ProjectAuthConfig = (props) => {
    const columns = [
        {
            title: '功能',
            dataIndex: 'title',
            key: 'name',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (index === 0) {
                    obj.props.rowSpan = 4;
                }
                if (index === 1) {
                    obj.props.rowSpan = 0;
                }
                if (index === 2) {
                    obj.props.rowSpan = 0;
                }
                if (index === 3) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            },
        },

        {
            title: '功能点',
            dataIndex: 'feature',
            key: 'age',
        },
        {
            title: 'ce',
            dataIndex: 'ce',
            key: 'ce',
            render: (text) => {
                return text ? <CheckOutlined /> : <CloseOutlined />
            }
        },
        {
            title: 'ee',
            dataIndex: 'ee',
            key: 'ee',
            render: (text) => {
                return text ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    ];
    const dataSource = [
        {
            key: '1',
            title:"基本功能",
            feature: '知识库管理',
            ce: false,
            ee: true,
            rowSpan: 4
        },
        {
            key: '2',
            title:"基本功能",
            feature: '文档管理',
            ce: false,
            ee: true,
            rowSpan: 0
        },
        {
            key: '3',
            title:"基本功能",
            feature: '目录管理',
            ce: false,
            ee: true,
            rowSpan: 0
        },
        {
            key: '4',
            title:"基本功能",
            feature: '模板管理',
            ce: true,
            ee: true,
            rowSpan: 0
        },
        {
            key: '5',
            title:"升级功能",
            feature: '脑图',
            ce: false,
            ee: true,
            rowSpan: 2
        }
    ]
    return (
        <Version bgroup="sward">
            <Table
                bordered
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{
                    x: "100%"
                }}
            />
        </Version>
       
    )
}
export default ProjectAuthConfig;