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
import { Row, Col } from 'antd';
import "./TemplatePreview.scss"
import { PreviewEditor } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import TemplateStore from "../store/TemplateStore";
import { getUser } from "tiklab-core-ui";
import Breadcrumb from "../../../common/components/breadcrumb/Breadcrumb";

const TemplatePreview = (props) => {
    const { relationWorkStore } = props;
    const { findDocumentTemplate } = TemplateStore;

    const templateId = props.match.params.templateId;
    const [value, setValue] = useState()

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
    }, [templateId])
    return (
        <Row className="template-view">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <Breadcrumb
                    firstText={'模板'}
                    secondText={titleValue}
                    firstUrl={`/setting/template`}
                >
                </Breadcrumb>
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
            </Col>
        </Row>
    )
}

export default inject("relationWorkStore")(observer(TemplatePreview));
