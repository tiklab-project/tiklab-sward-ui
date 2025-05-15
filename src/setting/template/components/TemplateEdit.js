/*
 * @Descripttion: 模版编辑
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-07 10:20:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:11:43
 */
import React, { useState, useEffect, useRef } from "react";
import { observer, inject } from "mobx-react";
import { Input, Row, Col, Modal } from 'antd';
import { EditorBig, EditorBigContent } from "tiklab-slate-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import Button from "../../../common/components/button/Button";
import TemplateStore from "../store/TemplateStore";
import "./templateEdit.scss"
import { getUser } from "tiklab-core-ui";
import html2canvas from "html2canvas";
const TemplateEdit = (props) => {
    const templateId = props.match.params.templateId;
    const { createDocumentTemplate, findDocumentTemplateList, findDocumentTemplate,
        updateDocumentTemplate, upload, getIconList } = TemplateStore;
    const [editorValue, setEditorValue] = useState("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]")

    const [titleValue, setTitleValue] = useState("未命名模板");
    const [buttonText, setButtonText] = useState(templateId ? "更改模板" : "创建模板")
    const [visable, setVisable] = useState(false)
    const editRef = useRef();

    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    useEffect(() => {
        if (templateId) {
            setEditorValue()
            findDocumentTemplate(templateId).then(data => {
                const value = data.data
                if (data.code === 0) {
                    setTitleValue(value.name)
                    setEditorValue(value.details)
                }
            })
        }
        return;
    }, [templateId])



    const addTemplate = (iconUrl) => {
        const data = {
            name: titleValue,
            iconUrl: "/image/" +iconUrl,
            detailText: editRef.current.innerText,
            details: editorValue
        }

        if (!templateId) {
            createDocumentTemplate(data).then(data => {
                if (data.code === 0) {
                    findDocumentTemplateList().then(data => {
                        if (data.code === 0) {
                            // setTemplateList(data.data.dataList)
                            props.history.goBack()
                        }
                    })
                }
            })
        } else {
            data.id = templateId
            updateDocumentTemplate(data).then(data => {
                if (data.code === 0) {
                    findDocumentTemplateList().then(data => {
                        if (data.code === 0) {
                            // setTemplateList(data.data.dataList)
                            props.history.goBack()
                        }
                    })
                }
            })
        }
    }


    const submit = async() =>{
        let url = ""
        const opt = {
            useCORS: true
        }
        let canvas = await html2canvas(document.getElementById("template-detail"), opt);//获取要生成图片的dom区域并转为canvas;记得引入html2canvas插件喔
        let base64Img = canvas.toDataURL();//将canvas转为base64
        let formdata = new FormData();
        formdata.append("uploadFile", toImgStyle(base64Img, Date.now() + '.png'));//此处参数一字段为后端要求，参数二后端要求传递形式为png，所以此处又调用toImgStyle方法将base64转为png格式
        upload(formdata).then(res => {
            if(res.code === 0){
                addTemplate(res.data)
            }
        })
        return url;
	}

    /**
     * base64转图片文件方法**
     */

    const toImgStyle = (base64Str, fileName)=>{
      var arr = base64Str.split(','),
      mime = arr[0].match(/:(.*?);/)[1], //base64解析出来的图片类型
      bstr = atob(arr[1]), //对base64串进行操作，去掉url头，并转换为byte   atob为window内置方法
      len = bstr.length,
      u8arr = new Uint8Array(len); //
      while (len--) {
          u8arr[len] = bstr.charCodeAt(len)
      };
      // 创建新的 FileView 对象实例[utf-8内容，文件名称或者路径，[可选参数，type：文件中的内容mime类型]]
      return new File([u8arr], fileName, {
          type: mime
      })
    }


    return (
        <Row className="template-add">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <>
                    <div className="template-add-title">
                        <div className="template-add-top">
                            <div className="template-add-breadcrumb">
                                <span onClick={() => props.history.goBack()} className="template-back">模板</span>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-rightBlue"></use>
                                </svg>
                                <span>{titleValue}</span>
                            </div>
                            <div>
                                {
                                    !titleValue ? <Button>{buttonText}</Button>
                                        :
                                        <Button onClick={() => submit()} type="primary">{buttonText}</Button>
                                }

                            </div>
                        </div>

                    </div>

                    {
                        editorValue &&
                        <EditorBig
                            value={editorValue}
                            onChange={value => setEditorValue(value)}
                            base_url = {upload_url}
                            img_url = {upload_url}
                            viewImageUrl = "/image"
                            ticket={ticket}
                            tenant={tenant}
                        >
                            <>
                                <div className="template-content">
                                    <Input
                                        className="template-title-input"
                                        bordered={false}
                                        onChange={(value) => setTitleValue(value.target.value)}
                                        value={titleValue}
                                        placeholder="标题"
                                    />
                                    <div ref={editRef} id = "template-detail" className="template-detail">
                                      <EditorBigContent
                                        base_url={upload_url}
                                        value={editorValue}
                                        onChange={setEditorValue}
                                    />
                                    </div>
                                </div>
                            </>
                        </EditorBig>
                    }
                    <Modal
                        visible={visable}
                        title={"编辑"}
                        cancelText="只更改内容"
                        okText="同时更改内容和图标"
                    >
                        <p>是否同时更改图标</p>
                    </Modal>
                </>
            </Col>
        </Row>
    )
}

export default observer(TemplateEdit);
