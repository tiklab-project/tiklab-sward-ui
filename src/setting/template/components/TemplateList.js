/*
 * @Descripttion: 模板列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-07 09:34:01
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:57
 */
import React, { useState, useEffect, Fragment } from "react";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Modal, Table, Space } from 'antd';
import "../components/TemplateList.scss"
import { observer, inject } from "mobx-react";
import Breadcrumb from "../../../common/components/breadcrumb/Breadcrumb";
import Button from "../../../common/components/button/Button";
import TemplateStore from "../store/TemplateStore";
import weekly from "../../../assets/images/weekly.png";
import weeklyNomal from "../../../assets/images/weeklyNomal.png";
import todoWork from "../../../assets/images/todoWork.png";
import projectPlan from "../../../assets/images/projectPlan.png";
import projectOperation from "../../../assets/images/projectOperation.png";


const { confirm } = Modal;
const Template = (props) => {
    const { findDocumentTemplateList, deleteDocumentTemplate, templateList } = TemplateStore;

    const imgUrlArray = [weekly, weeklyNomal, todoWork, projectPlan, projectOperation]
    useEffect(() => {
        findDocumentTemplateList()
        return;
    }, [])
    const addModal = () => {
        props.history.push("/setting/templateAdd")

    }

    const goView = (id) => {
        props.history.push(`/setting/templateView/${id}`)
    }
    // 删除模板
    const showDeleteConfirm = (name, id) => {

        confirm({
            title: `确定删除${name}?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteDocumentTemplate(id).then(data => {
                    findDocumentTemplateList()
                })
            },
            onCancel() {

            },
        });
    }

    const goTemplateEdit = (id) => {
        props.history.push(`/setting/templateAdd/${id}`)
    }


    return (
        <Fragment>
            {/* <Layout > */}
                <Row style={{ height: "100%", overflow: "auto" }} >
                    <Col xl={{ span: 18, offset: 3 }} lg={{ span: 20, offset: 2 }} className="repository-template">
                        <Breadcrumb
                            firstText="文档模板"
                        >
                            <Button type="primary" onClick={() => addModal()} >添加模板</Button>
                        </Breadcrumb>
                        {/* <Table
                            columns={columns}
                            dataSource={templateList}
                            rowKey={record => record.id}
                            pagination={false}
                        /> */}
                        <div className="template-list">
                            {
                                templateList && templateList.map((item, index) => {
                                    return <div className="template-box" key={index}>
                                        <div className="template-name"  onClick={() => goView(item.id)}>{item.name}</div>
                                        <img
                                            src={imgUrlArray[index]}
                                            alt=""
                                            className="template-image"
                                        />
                                        <div className="template-action">
                                            <Button className="template-delete" onClick = {()=> showDeleteConfirm(item.name, item.id)}>删除</Button>
                                            <Button className="template-edit" type="primary" onClick = {() => goTemplateEdit(item.id)}>编辑</Button>
                                        </div>
                                    </div>
                                })
                            }
                        </div>

                    </Col>
                </Row>
            {/* </Layout> */}
        </Fragment>
    )
}

export default observer(Template);
