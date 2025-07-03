/*
 * @Descripttion: markdown文档编辑
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:19:57
 */
import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import "./MarkdownEdit.scss";
import { Markdown } from "tiklab-markdown-ui";
import Button from "../../../common/components/button/Button";
import MarkdownStore from "../store/MarkdownStore";
import "tiklab-markdown-ui/es/tiklab-markdown.css";
import RepositoryDetailStore from "../../../repository/common/store/RepositoryDetailStore";
import { Node } from "slate";
import { Empty, message } from "antd";
import { useDebounce } from "../../../common/utils/debounce";
const MarkdownEdit = (props) => {
    const { findDocument, updateDocument } = MarkdownStore;
    const { documentTitle, setDocumentTitle,repository } = RepositoryDetailStore;
    const [documentDate, setDocumentDate] = useState();
    const [docInfo, setDocInfo] = useState();
    const documentId = props.match.params.id;
    const repositoryId = props.match.params.repositoryId;
    const [value, setValue] = useState();
    const path = props.location.pathname.split("/")[3];
    const repositoryStatus = repository?.status !== 'nomal';

    // 查找文档详情
    useEffect(() => {
        setValue()
        findDocument(documentId).then((data) => {
            if (data.code === 0) {
                if (data.data.details) {
                    const value = data.data.details;
                    setValue(JSON.parse(value))
                } else {
                    setValue([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '**make** **decorations** to  it _dead_ simple .',
                                },
                            ],
                        }
                    ])
                }
                const node = data.data.node;
                setDocInfo(node)
                setDocumentTitle(node.name)
                setDocumentDate(node.updateTime || node.createTime)
            }
        })
    }, [documentId])

    // 保存文档
    const save = () => {
        saveDocument(value, "click")
        // editRef.current.submit()
    }

    /**
     * 获取文档中的文本， 文本用于搜索
     * @param {*} nodes
     * @returns
     */
    const serialize = nodes => {
        const text = nodes.map(n => Node.string(n)).join('\n');
        return text;
    }

    /**
     * 保存文档
     * @param {*} value
     * @param {*} type
     */
    const saveDocument = (value, type) => {
        setValue(value)
        const serializeValue = serialize(value)
        const data = {
            repositoryId: repositoryId,
            id: documentId,
            details: JSON.stringify(value),
            detailText: serializeValue
        }
        updateDocument(data).then(res => {
            if (type === "click") {
                if (res.code === 0) {
                    message.success("保存成功")
                } else {
                    message.error("保存失败")
                }
            }
        })
    }

    /**
     * 节流保存，500ms 保存一次
     */
    const changeEdit = useDebounce((value) => {
        saveDocument(value, "auto")
    }, [500])

    /**
     * 修改标题
     * @param {*} value
     */
    const changeTitle = (value) => {
        // setTitleValue(value.target.value)
        console.log(value)
        const data = {
            repositoryId: repositoryId,
            id: documentId,
            node: {
                id: documentId,
                name: value.target.innerText
            }
        }
        updateDocument(data).then(res => {
            if (res.code === 0) {
                console.log(res.code)
                document.getElementById("examine-title").innerHTML = value.target.innerText;
                document.getElementById("file-" + documentId).innerHTML = value.target.innerText
            } else {
                message.error("保存失败")
            }
        })
        setIsFocus(false)
        document.getElementById("examine-title").blur()
    }

    const [isFocus, setIsFocus] = useState()

    /**
     * 敲击回车保存标题
     * @param {按键} event
     */
    const keyDown = (event) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            changeTitle(event)
        }
    }

    // 聚焦
    const focus = () => {
        document.getElementById("examine-title").focus()
        setIsFocus(true)
    }

    // 跳转到查看界面
    const goExamine = () => {
        // 在目录页面
        if (path === "doc") {
            props.history.push(`/repository/${repositoryId}/doc/markdown/${documentId}`)
        }
        // 在收藏页面
        if (path === "collect") {
            props.history.push(`/repository/${repositoryId}/collect/markdown/${documentId}`)
        }
    }

    return <>
        {
            docInfo?.recycle === "0" ?
            <div className="document-markdown-edit">
                <div className="edit-top" style={props?.collapsed ? {paddingLeft:40} : {}}>
                    <div className={`edit-title`}>
                        <div
                            contentEditable={true}
                            suppressContentEditableWarning
                            className={`edit-title-top ${isFocus ? "edit-title-focus" : ""}`}
                            onBlur={(event) => changeTitle(event)}
                            onKeyDown={(event => keyDown(event))}
                            onClick={() => focus()}
                            id="examine-title"
                        >
                            {documentTitle}
                        </div>
                        <div className="edit-title-date">
                            更新日期：{documentDate}
                        </div>
                    </div>
                    <div className="edit-right">
                        <Button type="primary" className="edit-right-save" onClick={() => save()}>保存</Button>
                        <Button className="edit-right-eqit" onClick={() => goExamine()}>退出</Button>
                    </div>
                </div>
                <div className="edit-markdown" style={{ height: "calc(100% - 60px)" }}>
                    {
                        value && <Markdown value={value} setValue={setValue} onChange={(value) => changeEdit(value)} />
                    }
                </div>
            </div>
              :
              <div className="document-markdown-empty">
                   <Empty description="文档已被移动到回收站，请去回收站恢复再查看" />
              </div>
        }
    </>
}

export default withRouter(MarkdownEdit);
