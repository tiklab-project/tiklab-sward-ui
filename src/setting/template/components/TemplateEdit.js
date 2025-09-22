/*
 * @Descripttion: 模版编辑
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-07 10:20:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:43
 */
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { Input, Row, Col } from 'antd';
import { EditorBig, EditorBigContent } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import Button from "../../../common/components/button/Button";
import Breadcrumb from "../../../common/components/breadcrumb/Breadcrumb";
import templateStore from "../store/TemplateStore";
import "./templateEdit.scss"
import { getUser } from "tiklab-core-ui";
import {useDebounce} from "../../../common/utils/debounce";
import html2canvas from "html2canvas";

const TemplateEdit = (props) => {

    const { findDocumentTemplate, updateDocumentTemplate } = templateStore;

    const tmp = "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]";
    const templateId = props.match.params.templateId;
    const editRef = useRef(null);
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;

    const [editorValue, setEditorValue] = useState(null);
    const [titleValue, setTitleValue] = useState("未命名模板");
    const [documentTemplate,setDocumentTemplate] = useState(null);

    useEffect(() => {
        if (templateId) {
            findDocumentTemplate(templateId).then(data => {
                if (data.code === 0) {
                    const value = data.data;
                    setDocumentTemplate(value);
                    setTitleValue(value.name);
                    setEditorValue(value.details ? value.details : tmp);
                }
            })
        }
    }, [templateId])


    const updateDesc = useDebounce((value) => {
        setEditorValue(value);
        updateDocumentTemplate({
            ...documentTemplate,
            name: titleValue,
            detailText: editRef.current.innerText,
            details: value
        })
    }, 500)

    const submit = async () =>{
        let canvas = await html2canvas(document.getElementById("template-detail"), {
            useCORS: true
        });
        let base64Img = canvas.toDataURL();
        updateDocumentTemplate({
            ...documentTemplate,
            name: titleValue,
            detailText: editRef.current.innerText,
            details: editorValue,
            iconUrl: base64Img,
        }).then(data => {
            if (data.code === 0) {
                props.history.push(`/setting/template`)
            }
        })
    }

    return (
        <Row className="template-add">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <Breadcrumb
                    firstText={'模板'}
                    secondText={titleValue}
                    firstUrl={`/setting/template`}
                >
                    <Button onClick={submit} type="primary">保存</Button>
                </Breadcrumb>
                {
                    editorValue &&
                    <EditorBig
                        value={editorValue}
                        onChange={value => updateDesc(value)}
                        base_url={upload_url}
                        img_url={upload_url}
                        viewImageUrl="/image"
                        ticket={ticket}
                        tenant={tenant}
                    >
                        <div className="template-content">
                            <Input
                                className="template-title-input"
                                bordered={false}
                                onChange={(value) => setTitleValue(value.target.value)}
                                value={titleValue}
                                placeholder="标题"
                            />
                            <div ref={editRef} id="template-detail" className="template-detail">
                                <EditorBigContent
                                    base_url={upload_url}
                                    value={editorValue}
                                    onChange={setEditorValue}
                                />
                            </div>
                        </div>
                    </EditorBig>
                }
            </Col>
        </Row>
    )
}

export default observer(TemplateEdit);
