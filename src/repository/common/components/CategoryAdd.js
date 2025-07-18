/*
 * @Descripttion: 目录添加
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-03 09:42:40
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:58:17
 */

import React from 'react';
import { observer, inject } from "mobx-react";
import { Select, Form, Input } from 'antd';
import { appendNodeInTree } from '../../../common/utils/treeDataAction';
import BaseModal from "../../../common/components/modal/Modal";

const CategoryAdd = (props) => {
    const { treePath, addModalVisible, setAddModalVisible, category, form, userList, repositoryDetailStore } = props
    const { addRepositoryCatalogue, setRepositoryCatalogueList,
        repositoryCatalogueList, expandedTree, setExpandedTree, findCategory } = repositoryDetailStore;
    const repositoryId = props.match.params.repositoryId;

    // 关闭目录树
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
        } else {
            setExpandedTree(expandedTree.concat(key));
        }
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            let data;
            if (category) {
                data = {
                    ...values,
                    wikiRepository: { id: repositoryId },
                    master: { id: values.master },
                    type: "category",
                    treePath: treePath,
                    parent: { id: category.id },
                    dimension: category.dimension + 1,
                }
            } else {
                data = {
                    ...values,
                    wikiRepository: { id: repositoryId },
                    master: { id: values.master },
                    dimension: 1,
                    type: "category"
                }
            }
            addRepositoryCatalogue({node: data}).then((data) => {
                if (data.code === 0) {
                    findCategory({ id: data.data }).then(res => {
                        if (res.code === 0) {
                            const list = appendNodeInTree(category?.id, repositoryCatalogueList, [res.data.node]);
                            setRepositoryCatalogueList([...list])
                        }
                    })
                    setAddModalVisible(!addModalVisible)
                    if (category?.id) {
                        setOpenOrClose(category.id)
                    }
                    props.history.push(`/repository/${repositoryId}/doc/folder/${data.data}`)
                    form.resetFields()
                }

            })
        })
    }
    // const selectType = () => {

    // }
    return (
        <BaseModal
            title={"添加目录"}
            visible={addModalVisible}
            onOk={onFinish}
            onCancel={() => setAddModalVisible(false)}
            destroyOnClose={true}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                labelAlign="right"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    label="名字"
                    name="name"
                    rules={[{ required: true, message: '请输入目录名字!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="负责人" name="master" rules={[{ required: true }]} >
                    <Select
                        placeholder="负责人"
                        allowClear
                        className="work-select"
                        key="master"
                        style={{ minWidth: '80px' }}
                    >
                        {
                            userList && userList.map((item) => {
                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user.nickname}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        </BaseModal>
    )
}

export default inject("repositoryDetailStore")(observer(CategoryAdd));
