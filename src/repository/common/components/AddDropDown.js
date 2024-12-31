/*
 * @Descripttion: 添加下拉框
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-31 09:03:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:57:33
 */
import React, { useState } from "react";
import { Form, Menu, Dropdown } from "antd";
import CategoryAdd from "./CategoryAdd";
import { appendNodeInTree } from "../../../common/utils/treeDataAction";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";

const AddDropDown = (props) => {
    const [form] = Form.useForm();
    const { category, repositoryDetailStore, isButton, button } = props;
    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;
    const treePath = category ?
        (category.treePath ? category.treePath + category.id + ";" : category.id + ";") : null;
    const [addModalVisible, setAddModalVisible] = useState()
    const [userList, setUserList] = useState()
    const [catalogue, setCatalogue] = useState()
    const [contentValue, setContentValue] = useState()
    const { repositoryCatalogueList, setRepositoryCatalogueList,
        createDocument, findDmUserList, findDocument } = repositoryDetailStore;

    const addMenu = () => {
        return <Menu onClick={(value) => selectAddType(value)}>
            <Menu.Item key="category">
                <div className="content-add-menu">
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-folder"></use>
                    </svg>
                    添加目录
                </div>

            </Menu.Item>
            <Menu.Item key="document">
                <div className="content-add-menu">
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-file"></use>
                    </svg>
                    添加文档
                </div>

            </Menu.Item>
            <Menu.Item key="markdown">
                <div className="content-add-menu">
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-minmap"></use>
                    </svg>
                    添加Markdown
                </div>
            </Menu.Item>
        </Menu>
    }
    const selectAddType = (value) => {
        if (value.key === "category") {
            if (category) {
                setCatalogue({ id: category.id, dimension: category.dimension })
            }

            setAddModalVisible(true)
            findDmUserList(repositoryId).then(data => {
                setUserList(data)
            })
            form.setFieldsValue({
                formatType: value.key
            })
            return
        }

        let params = {
            node: {
                name: "未命名文档",
                wikiRepository: { id: repositoryId },
                master: { id: userId },
                type: "document",
                dimension: category ? category.dimension + 1 : 1,
                parent: category ? {
                    id: category ? category.id : null,
                    treePath: category ? category.treepath : null
                } : null
            }
        }
        if (value.key === "document") {
            params.node.documentType = "document"
        }
        if (value.key === "markdown") {
            params.node.documentType = "markdown";
            params.details = JSON.stringify([
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: '',
                        },
                    ],
                },
            ])
        }
        if (value.key !== "category") {
            createDocument(params).then((data) => {
                if (data.code === 0) {
                    findDocument(data.data).then(res => {
                        const list = appendNodeInTree(category?.id, repositoryCatalogueList, [res.data.node])
                        setRepositoryCatalogueList([...list])
                    })
                    if (value.key === "document") {
                        props.history.push(`/repository/${repositoryId}/doc/rich/${data.data}/edit`)
                    }
                    if (value.key === "markdown") {
                        props.history.push(`/repository/${repositoryId}/doc/markdown/${data.data}/edit`)
                    }

                }
            })
        }
    }
    return (
        <div onClick={(event) => event.stopPropagation()} className="category-add">
            {/* {
                isButton ? <Dropdown overlay={() => addMenu()} placement="bottomLeft">
                    <div className="top-add-botton">添加</div>
                </Dropdown>
                    :
                    <Dropdown overlay={() => addMenu()} placement="bottomLeft">
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref="#icon-plusBlue"></use>
                        </svg>
                    </Dropdown>
            } */}
            {
                button === "icon-gray" && <Dropdown overlay={() => addMenu()} placement="bottomLeft">
                    <svg className="icon-18" aria-hidden="true">
                        <use xlinkHref="#icon-plusBlue"></use>
                    </svg>
                </Dropdown>
            }
            {
                button === "text" && <Dropdown overlay={() => addMenu()} placement="bottomLeft">
                    <div className="top-add-botton">添加</div>
                </Dropdown>
            }

            {
                button === "icon-blue" && <Dropdown overlay={() => addMenu()} placement="bottomLeft">
                    <svg className="icon-18" aria-hidden="true">
                        <use xlinkHref="#icon-add-blue"></use>
                    </svg>
                </Dropdown>
            }
            <CategoryAdd
                setAddModalVisible={setAddModalVisible}
                addModalVisible={addModalVisible}
                form={form}
                category={category}
                contentValue={contentValue}
                treePath={treePath}
                // setSelectKey={setSelectKey}
                userList={userList}
                {...props}
            />
        </div>

    )
}

export default withRouter(inject("repositoryDetailStore")(observer(AddDropDown)));