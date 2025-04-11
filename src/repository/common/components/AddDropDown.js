/*
 * @Descripttion: 添加下拉框
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-31 09:03:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 16:57:33
 */
import React, {useRef, useState} from "react";
import {Form, Menu, Dropdown, message} from "antd";
import CategoryAdd from "./CategoryAdd";
import { appendNodeInTree } from "../../../common/utils/treeDataAction";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
import TemplateStore from "../../../setting/template/store/TemplateStore";
import { formatFileSize } from "../../../common/utils/overall";

const AddDropDown = (props) => {
    const [form] = Form.useForm();
    const { category, repositoryDetailStore, isButton, button } = props;

    const {upload} = TemplateStore;

    const repositoryId = props.match.params.repositoryId;
    const userId = getUser().userId;
    const treePath = category ?
        (category.treePath ? category.treePath + category.id + ";" : category.id + ";") : null;
    const [addModalVisible, setAddModalVisible] = useState()
    const [userList, setUserList] = useState()
    const [catalogue, setCatalogue] = useState()
    const [contentValue, setContentValue] = useState()
    const { repositoryCatalogueList, setRepositoryCatalogueList,
        createDocument, findDmUserList, findDocument ,repository} = repositoryDetailStore;

    const fileInputRef = useRef(null);

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
            <Menu.Item key="file">
                <div className="content-add-menu">
                    <svg className="content-add-icon" aria-hidden="true">
                        <use xlinkHref="#icon-file"></use>
                    </svg>
                    上传本地文件
                </div>
            </Menu.Item>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                // accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
        </Menu>
    }

    /**
     * 创建类型
     * @param value
     */
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
        if (value.key === 'file') {
            fileInputRef.current.click();
            return;
        }
        //创建文档
        setCreateDocument(value.key)
    }

    // 20MB
    const MAX_FILE_SIZE = 20 * 1024 * 1024;

    // 允许的文件类型
    const ALLOWED_FILE_TYPES = [
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ];

    /**
     * 上传文件
     * @param event
     */
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            // //检查文件类型
            // if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            //     message.error(`文件 ${file.name} 类型不支持，仅支持 Word、Excel 和 PowerPoint 文件`);
            //     event.target.value = '';
            //     return;
            // }
            //检查文件大小
            if (file.size > MAX_FILE_SIZE) {
                message.error(`文件 ${file.name} 大小超过限制（最大 20MB）`);
                event.target.value = '';
                return;
            }
            //格式化文件大小
            const formattedSize = formatFileSize(file.size);
            //请求数据
            const formData = new FormData();
            formData.append('uploadFile', file);
            upload(formData).then((res) => {
                if (res.code === 0) {
                    setCreateDocument('file', {
                        name: file.name,
                        fileSize: formattedSize,
                        fileUrl: res.data,
                    });
                } else {
                    message.error('上传失败');
                }
            }).finally(()=>{
                event.target.value = '';
            })
        }
    };

    /**
     * 创建文档
     */
    const setCreateDocument = (documentType, value) => {
        let params = {
            node: {
                name: "未命名文档",
                wikiRepository: { id: repositoryId },
                master: { id: userId },
                documentType: documentType,
                type: "document",
                dimension: category ? category.dimension + 1 : 1,
                parent: category ? {
                    id: category ? category.id : null,
                    treePath: category ? category.treepath : null
                } : null
            }
        }
        if(documentType==='markdown'){
            params.details = JSON.stringify([
                {
                    type: 'paragraph',
                    children: [{text: '',},],
                },
            ])
        }
        if(documentType==='file' && value ){
            const {name,...rest} = value;
            const details = JSON.stringify(rest);
            params.node.name = name;
            params.details = details;
        }
        createDocument(params).then((data) => {
            if (data.code === 0) {
                findDocument(data.data).then(res => {
                    const list = appendNodeInTree(category?.id, repositoryCatalogueList, [res.data.node])
                    setRepositoryCatalogueList([...list])
                })
                if (documentType === "document") {
                    props.history.push(`/repository/${repositoryId}/doc/rich/${data.data}/edit`)
                }
                if (documentType === "markdown") {
                    props.history.push(`/repository/${repositoryId}/doc/markdown/${data.data}/edit`)
                }
                if(documentType==='file'){
                    props.history.push(`/repository/${repositoryId}/doc/file/${data.data}`)
                }
            }
        })
    }

    return repository?.status === 'nomal' && (
        <div onClick={(event) => event.stopPropagation()} className="category-add">
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
