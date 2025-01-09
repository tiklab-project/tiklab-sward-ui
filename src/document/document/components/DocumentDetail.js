/*
 * @Descripttion: 文档详情
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:05:47
 */
import React,{useState} from "react";
import { Breadcrumb, message} from 'antd';
import { Provider, observer } from "mobx-react";
import "./documentDetail.scss";
import DocumentExamine from "./DocumentExamine";
import {withRouter} from "react-router-dom";
import DocumentEdit from "./DocumentEdit";
import DocumentStore from "../store/DocumentStore";
const DocumentDetail = (props)=>{
    const store = {
        documentStore: DocumentStore
    }
    const {updateDocument} = DocumentStore;


    const [editOrExamine,seteditOrExamine] = useState("examine")

    /**
     * 转到编辑模式
     * @param {类型} type
     */
    const changePageType = (type) => {
        seteditOrExamine(type)
    }

    const documentId = props.match.params.id;

    // 保存内容，转到查看模式
    const save = (type) => {
        seteditOrExamine(type)
        saveDocument(value)
        // editRef.current.submit()
    }

    /**
     * 保存文档
     * @param {*} value
     */
    const saveDocument = (value) => {
        setValue(value)
        const serialize = JSON.stringify(value)

        /** deatailText 没更新到 */
		const data = {
			id: documentId,
			details: serialize
		}
		updateDocument(data).then(res => {
			if (res.code === 0) {
				message.success("保存成功")
			}else {
                message.error("保存失败")
            }
		})
    }
    return (<Provider {...store}>
        <div className="documnet-detail">
            <div className="documnet-detail-header">
                <Breadcrumb>
                    <Breadcrumb.Item>知识库管理</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/">文档详情</a>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="documnet-detail-button">
                    {
                        editOrExamine === "examine" ?<span onClick={()=>changePageType("edit")}>编辑</span> :
                            <span onClick={()=>save("examine")}>保存</span>
                    }
                </div>
            </div>
            {
                editOrExamine === "examine" ? <DocumentExamine {...props} /> :
                    <DocumentEdit {...props} />
            }
        </div>
    </Provider>

    )
}
export default observer(withRouter(DocumentDetail));
