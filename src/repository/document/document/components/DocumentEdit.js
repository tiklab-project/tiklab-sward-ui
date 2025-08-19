/*
 * @Descripttion: 文档编辑模式
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:09:36
 */
import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Input, message, Empty } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import "./DocumentEdit.scss";
import { EditorBigContent, EditorBig } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import Button from "../../../../common/components/button/Button";
import DocumentStore from "../store/DocumentStore";
import RepositoryDetailStore from "../../../common/store/RepositoryDetailStore";
import { getUser } from "tiklab-core-ui";
import { useDebounce } from "../../../../common/utils/debounce";
import { updateNodeName } from "../../../../common/utils/treeDataAction";
import SelectTemplateList from "./SelectTemplateList";
import Template from "../../../../assets/images/template.png";

const DocumentEdit = (props) => {
    const { relationWorkStore } = props;
    const { findDocument, updateDocument, findDocumentTemplateList } = DocumentStore;
    const { documentTitle, setDocumentTitle, repositoryCatalogueList,fileLimit } = RepositoryDetailStore
    const documentId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const tmp = "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]";
    const [docInfo, setDocInfo] = useState({ name: "", likenumInt: "", commentNumber: "", master: { name: "" } });
    const [value, setValue] = useState(null);
    const [valueIsEmpty, setValueIsEmpty] = useState(false);
    const editRef = useRef(null);
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const [templateVisible, setTemplateVisible] = useState(false);
    const [templateList, setTemplateList] = useState([])

    /**
     * 查找文档模版
     */
    useEffect(() => {
        findDocumentTemplateList().then(data => {
            if (data.code === 0) {
                setTemplateList(data?.data || [])
            }
        })
    }, [])

    /**
     * 查找文档详情接口
     */
    useEffect(() => {
        setValue(null)
        findDocument(documentId).then((data) => {
            if (data.code === 0) {
                const detailDocument = data?.data?.node;
                setDocumentTitle(detailDocument.name)
                if (data?.data?.details) {
                    setValue(data?.data?.details);
                } else {
                    setValue(tmp)
                }
                setDocInfo(detailDocument)
            }
        })
    }, [documentId])

    useEffect(() => {
        if (value) {
            setValueIsEmpty(determineValue(value))
        }
    }, [value])

    const save = () => {
        saveDocument(value)
        // editRef.current.submit()
    }

    const saveDocument = (value) => {
        setValue(value)
        const data = {
            repositoryId: repositoryId,
            id: documentId,
            details: value,
            detailText: editRef.current?.innerText
        }
        updateDocument(data).then(res => {
            if (res.code === 0) {
                message.success("保存成功")
            } else {
                message.error("保存失败")
            }
        })
    }

    const updataDesc = useDebounce((value) => {
        setValue(value);
        const data = {
            repositoryId: repositoryId,
            id: documentId,
            details: value,
            detailText: editRef.current?.innerText
        }
        updateDocument(data)
    }, [500])

    const changeTitle = (value) => {
        setDocumentTitle(value.target.value)
        const data = {
            repositoryId: repositoryId,
            id: documentId,
            node: {
                id: documentId,
                name: value.target.value
            }

        }
        updateDocument(data).then(res => {
            if (res.code === 0) {
                document.getElementById("examine-title").innerHTML = value.target.value;
                document.getElementById("file-" + documentId).innerHTML = value.target.value;
                updateNodeName(repositoryCatalogueList, documentId, value.target.value)
            } else {
                message.error("保存失败")
            }
        })
    }

    /**
     * 判断文档是否为空，为空显示文档模版
     * @param {文档内容} value
     * @returns
     */
    const determineValue = (value) => {
        let isEmpty = true;
        const valueObject = JSON.parse(value);
        if (valueObject.length > 1) {
            isEmpty = false;
        }
        if (!(valueObject instanceof Array)) {
            isEmpty = false;
        }
        if (valueObject.length === 1) {
            if (valueObject[0].type === "paragraph") {
                if (valueObject[0].children[0].text === "") {
                    isEmpty = true;
                } else {
                    isEmpty = false;
                }
            } else {
                isEmpty = false;
            }
        }
        console.log(isEmpty)
        return isEmpty;
    }

    /**
     * 选择模板
     * @param {模板} item
     */
    const selectTemplate = (item) => {
        const data = {
            repositoryId: repositoryId,
            id: documentId,
            details: item.details,
            detailText: item.detailText
        }
        setValue(null)
        updateDocument(data).then(res => {
            if (res.code === 0) {
                setValue(item.details)
            } else {
                message.error("保存失败")
                setValue(tmp)
            }
        })
    }

    /**
     * 跳转到文档查看模式
     */
    const goExamine = () => {
        props.history.push(`/repository/${repositoryId}/doc/rich/${documentId}`)
    }

    return (<>
        {
            docInfo?.recycle === "0" ? <div className="documnet-edit">
                <div className="edit-top">
                    <div className="edit-title" >
                        <div className="edit-title-top" id="examine-title">
                            {docInfo.name}
                        </div>
                        <div className="edit-title-date">
                            更新日期：{docInfo.updateTime ? docInfo.updateTime : docInfo.createTime}
                        </div>
                    </div>
                    <div className="edit-right">
                        <Button type="primary" className="edit-right-save" onClick={() => save()}>保存</Button>
                        <Button className="edit-right-eqit" onClick={() => goExamine()}>退出</Button>
                    </div>
                </div>
                <div style={{ height: "calc(100% - 60px)" }}>
                    {
                        value && <EditorBig
                            value={value}
                            onChange={value => updataDesc(value)}
                            relationWorkStore={relationWorkStore}
                            base_url={upload_url}
                            img_url={upload_url}
                            viewImageUrl="/image"
                            ticket={ticket}
                            tenant={tenant}
                            fileSize={fileLimit?.docFileSize}
                            categoryMenu={true}
                        >
                            <Row className="document-examine-content">
                                <Col
                                    xs={{ span: 24}}
                                    md={{ span: 20, offset: 2 }}
                                    xl={{ span: 18, offset: 3 }}
                                    lg={{ span: 18, offset: 3 }}
                                >
                                    <div className="document-title">
                                        <Input
                                            className="document-title-input"
                                            bordered={false}
                                            onChange={(value) => setDocumentTitle(value.target.value)}
                                            value={documentTitle}
                                            onPressEnter={(value) => changeTitle(value)}
                                            onBlur={(value) => changeTitle(value)}
                                        />
                                    </div>
                                    <div ref={editRef}>
                                        <EditorBigContent
                                            value={value}
                                            relationWorkStore={relationWorkStore}
                                            base_url={upload_url}
                                        />
                                    </div>
                                    {
                                        valueIsEmpty &&
                                        <div className="template-select">
                                            <div className="template-title">推荐模版</div>
                                            <div className="template-list">
                                                {
                                                    templateList && templateList.map((item, index) => {
                                                        if(index > 2){
                                                            return
                                                        }
                                                        return (
                                                            <div className="template-box" key={index} onClick={() => selectTemplate(item)}>
                                                                <img src={item.iconUrl} alt="" className="template-image"/>
                                                                <div className="template-name">{item.name}</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className="template-box" key={0} onClick={() => setTemplateVisible(true)}>
                                                    <img
                                                        src={Template }
                                                        alt=""
                                                        className="template-image"
                                                    />
                                                    <div className="template-name">更多模版</div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </Col>
                            </Row>
                        </EditorBig>
                    }
                </div>
                <SelectTemplateList
                    {...props}
                    templateVisible={templateVisible}
                    setTemplateVisible={setTemplateVisible}
                    selectTemplate={selectTemplate}
                    templateList={templateList}
                />
            </div>
                :
                <div className="document-empty">
                   <Empty description="文档已被移动到回收站，请去回收站恢复再查看" />
                </div>

        }
    </>

    )
}
export default withRouter(inject("relationWorkStore")(observer(DocumentEdit)));
