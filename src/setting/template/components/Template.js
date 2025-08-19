/*
 * @Descripttion: 模板列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-07 09:34:01
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:57
 */
import React, {useEffect, useState} from "react";
import {EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {Row, Col, Modal, Empty, Table, Space, Tooltip, Dropdown, Select, Image} from 'antd';
import "./Template.scss"
import { observer } from "mobx-react";
import Breadcrumb from "../../../common/components/breadcrumb/Breadcrumb";
import Button from "../../../common/components/button/Button";
import TemplateStore from "../store/TemplateStore";
import TemplateModal,{templateType,templateTypeName} from "./TemplateModal";
import SearchSelect from "../../../common/components/search/SearchSelect";

const { confirm } = Modal;

const Template = (props) => {

    const { findDocumentTemplateList, deleteDocumentTemplate } = TemplateStore;

    //模版类型弹出框
    const [visible,setVisible] = useState(false);
    //模版
    const [templateList,setTemplateList] = useState([]);
    //表单字段
    const [formValue,setFormValue] = useState(null);
    //请求参数
    const [requestParam,setRequestParam] =  useState(null);
    //加载状态
    const [spinning,setSpinning] = useState(false);

    useEffect(() => {
        //获取模版
        findDocumentTemplate()
    }, [requestParam])

    /**
     * 获取模版
     */
    const findDocumentTemplate = () => {
        setSpinning(true);
        findDocumentTemplateList({
            ...requestParam,
            orderParams: [{name: "type", orderType: "asc"}]
        }).then(res=>{
            if(res.code===0){
                setTemplateList(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 打开添加弹出框
     */
    const addModal = () => {
        setVisible(true)
    }

    /**
     * 打开编辑弹出框
     * @param record
     */
    const editModal = (record) =>{
        setFormValue(record)
        setVisible(true)
    }

    /**
     * 筛选
     * @param changedValues
     */
    const changParams = (changedValues) => {
        const updatedParams = { ...requestParam,...changedValues };
        Object.keys(changedValues).forEach((key) => {
            if (changedValues[key] === "all") {
                delete updatedParams[key];
            }
        });
        setRequestParam(updatedParams)
    }

    /**
     * 进入编辑富文本状态
     * @param id
     */
    const goTemplateEdit = (id) => {
        props.history.push(`/setting/templateAdd/${id}`)
    }

    /**
     * 删除模板
     * @param record
     */
    const showDeleteConfirm = (record) => {
        const {name, id} = record;
        confirm({
            title: `确定删除${name}?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteDocumentTemplate(id).then(data => {
                    if(data.code===0){
                        findDocumentTemplate()
                    }
                })
            },
            onCancel() {

            },
        });
    }

    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            width: "30%",
            ellipsis: true,
            render: (text,record)=><span className="template-name" onClick={() =>goTemplateEdit(record.id)}>{text}</span>
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
            width: "30%",
            ellipsis: true,
            render: text=>templateTypeName[text]
        },
        {
            title: "缩略图",
            dataIndex: "iconUrl",
            key: "iconUrl",
            width: "30%",
            ellipsis: true,
            render: text=>text ? <Image src={text} alt="" width={60}/> : '--'
        },
        {
            title: '操作',
            dataIndex: "action",
            key: "action",
            width: "10%",
            ellipsis: true,
            render:(_,record)=>(
                <Space size={'middle'}>
                    <Tooltip titsle="修改">
                        <EditOutlined onClick={()=>editModal(record)}/>
                    </Tooltip>
                    <Dropdown
                        overlay={
                            <div className='sward-dropdown-more'>
                                <div className="dropdown-more-item" onClick={()=>showDeleteConfirm(record)}>
                                    删除
                                </div>
                            </div>
                        }
                        trigger={['click']}
                        placement={"bottomRight"}
                    >
                        <Tooltip title="更多">
                            <svg className="svg-icon" aria-hidden="true" >
                                <use xlinkHref="#icon-more-default"></use>
                            </svg>
                        </Tooltip>
                    </Dropdown>
                </Space>
            )
        }
    ]

    return (
        <Row className='repository-template'>
            <Col xs={{span:24}} sm={{span:24}} xl={{ span: 18, offset: 3 }} lg={{ span: 20, offset: 2 }}>
                <Breadcrumb firstText="模板">
                    <Button type="primary" onClick={addModal}>添加模板</Button>
                </Breadcrumb>
                <TemplateModal
                    {...props}
                    visible={visible}
                    setVisible={setVisible}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    findDocumentTemplate={findDocumentTemplate}
                />
                <div className='repository-template-search'>
                    <SearchSelect
                        placeholder={"类型"}
                        style={{width:150}}
                        onChange={value=>changParams({type:value})}
                    >
                        <Select.Option value={'all'}>全部</Select.Option>
                        {
                            templateType.map(type=>(
                                <Select.Option value={type} key={type}>{templateTypeName[type]}</Select.Option>
                            ))
                        }
                    </SearchSelect>
                </div>
                <Table
                    columns={columns}
                    dataSource={templateList}
                    rowKey={record => record.id}
                    pagination={false}
                    locale={{emptyText: <Empty />}}
                />
            </Col>
        </Row>
    )
}

export default observer(Template);
