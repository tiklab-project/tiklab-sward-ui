/*
 * @Descripttion: 模板列表弹窗组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-09 17:06:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:13:50
 */
import React, {useState, useRef} from 'react';
import { Row, Col } from 'antd';
import "./SelectTemplateList.scss";
import {templateType,templateTypeName} from "../../../../setting/template/components/TemplateModal";
import Modal from "../../../../common/components/modal/Modal";

const SelectTemplateList = (props) => {

    const { templateList,setTemplateVisible, templateVisible, selectTemplate } = props;

    const scrollRef = useRef(null);

    const [mouldType,setMouldType] = useState('meeting');

    const result = templateList.reduce((acc, item) => {
        const type = item.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(item);
        return acc;
    }, {});

    /**
     * 锚点跳转
     * @param anchorName
     */
    const changeAnchor = anchorName =>{
        const scrollTop= scrollRef.current
        const anchorElement = document.getElementById(anchorName)
        if (anchorElement) {
            scrollTop.scrollTop = anchorElement.offsetTop
        }
        setMouldType(anchorName)
    }

    /**
     * 滚动加载
     */
    const onScroll = () =>{
        // 获取滚动区域元素到页面顶部的偏移offsetTop
        const offsets = templateType.map(type=>{
            return {
                id: type,
                offsetTop: document.getElementById(type)?.offsetTop
            }
        })
        // 获取滚动区域滚动的距离
        const scrollTop = scrollRef.current.scrollTop
        // 获取第一个符合要求的对象
        const ids = offsets.find(item=> item.offsetTop===scrollTop || item.offsetTop>scrollTop)
        if(!ids){
            return;
        }
        if(ids.id===mouldType){
            return;
        }
        setMouldType(ids.id)
    }

    /**
     * 选择模板
     * @param item
     */
    const selectTemplateInModal = (item) => {
        selectTemplate(item)
        setTemplateVisible(false)
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        setTemplateVisible(false)
    }

    return (
        <Modal
            className="template-modal"
            title="选择模板"
            visible={templateVisible}
            width={750}
            onCancel={onCancel}
            footer={null}
        >
            <Row className='template-modal-content'>
                <Col span={5} className='template-modal-left'>
                    <div>
                        {
                            templateType.map(type=>(
                                <div
                                    key={type}
                                    className={`mould-group ${mouldType===type?'mould-group-select':''}`}
                                    onClick={()=>changeAnchor(type)}
                                >
                                    {templateTypeName[type]}
                                </div>
                            ))
                        }
                    </div>
                </Col>
                <Col span={19} className='template-modal-right' ref={scrollRef} onScroll={onScroll}>
                    <div>
                        {
                            templateType.map(type=>(
                                <div key={type} id={type} className='mould-group'>
                                    <div className='mould-group-title'>
                                        {templateTypeName[type]}
                                    </div>
                                    <div className='template-list'>
                                        {
                                            result[type] && result[type].map((item, index) => {
                                                return (
                                                    <div className="template-box" key={index} onClick={() => selectTemplateInModal(item)}>
                                                        <img
                                                            src={item.iconUrl}
                                                            alt=""
                                                            className="template-image"
                                                        />
                                                        <div className="template-name">{item.name}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}
export default SelectTemplateList;
