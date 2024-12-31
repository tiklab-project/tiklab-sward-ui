/*
 * @Descripttion: 模板查看
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-07 10:20:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:12:08
 */
import React, { useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Form, Row, Col } from 'antd';
import "./TemplatePreview.scss"
import { PreviewEditor } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import TemplateStore from "../store/TemplateStore";
import { getUser } from "tiklab-core-ui";
const TemplatePreview = (props) => {
    const [form] = Form.useForm();
    const { relationWorkStore } = props;
    const templateId = props.match.params.templateId;
    const { findDocumentTemplate } = TemplateStore;
    const [value, setValue] = useState()
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const [titleValue, setTitleValue] = useState();
    useEffect(() => {
        if (templateId) {
            setValue()
            findDocumentTemplate(templateId).then(data => {
                const value = data.data
                if (data.code === 0) {
                    setValue(value.details)
                    setTitleValue(value.name)
                }
            })
        }
        return;
    }, [templateId])
    return (
        <Row className="template-add">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>

                <div>
                    <div className="template-view-top">
                        <div className="template-view-breadcrumb">
                            <span onClick={() => props.history.goBack()} className="template-back">模板</span>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightBlue"></use>
                            </svg>
                            <span>{titleValue}</span>
                        </div>
                    </div>
                    {
                        value && <PreviewEditor 
                            value={value} 
                            relationWorkStore={relationWorkStore} 
                            base_url={upload_url} 
                            img_url = {upload_url}
                            viewImageUrl = "/image"
                            tenant={tenant} 
                        />
                    }
                    
                </div>
            </Col>
        </Row>
    )
}

export default inject("relationWorkStore")(observer(TemplatePreview));