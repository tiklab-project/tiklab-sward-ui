/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/5
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/5
 */
import React, { useEffect, useState } from "react";
import {Row, Col, message} from 'antd';
import Breadcrumb from "../../../../common/components/breadcrumb/Breadcrumb";
import "./Server.scss";
import serverStore from "../store/ServerStore";
import {productImg,disableFunction} from "tiklab-core-ui";
import {DownOutlined, RightOutlined} from "@ant-design/icons";
import Button from "../../../../common/components/button/Button";
import ServerKanassModal from "./ServerKanassModal";
import EnhanceEntranceModal from "../../../../common/components/modal/EnhanceEntranceModal";


const Server = (props) => {

    const {OnlyOfficeComponent} = props;

    const { findAllSystemUrl, deleteSystemUrl } = serverStore;

    //树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([]);
    //增强功能弹出框
    const [archivedFreeVisable,setArchivedFreeVisable] = useState(false);
    //kanass服务地址
    const [kanassUrl,setKanassUrl] = useState(null);
    //kanass服务地址弹出框
    const [kanassVisible,setKanassVisible] = useState(false);

    const disable = disableFunction();

    useEffect(() => {
        //获取kanass服务地址
        findKanassUrl()
    }, [])

    /**
     * 获取kanass服务地址
     */
    const findKanassUrl = () => {
        findAllSystemUrl().then(res => {
            setKanassUrl(res?.data?.[0])
        })
    }

    /**
     * 删除kanass服务地址
     */
    const delKanassUrl = () => {
        const params = new FormData();
        params.append("id", kanassUrl.id)
        deleteSystemUrl(params).then(res => {
            if(res.code === 0){
                setKanassUrl(null);
                message.info("删除成功")
            }
        })
    }

    /**
     * OnlyOffice
     */
    const addOnlyOffice = () => {
        setArchivedFreeVisable(true)
    }


    /**
     * 是否符合要求
     * @param key
     * @returns {boolean}
     */
    const isExpandedTree = key => {
        return expandedTree.some(item => item ===key)
    }

    /**
     * 展开和闭合
     * @param key
     */
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            // false--闭合
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            // ture--展开
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const lis = [
        {
            key: 'kanass',
            title:"Kanass",
            desc: "Kanass服务地址配置",
            icon: <img src={productImg.kanass} width={16} height={16} alt={'Kanass'}/>,
            enCode:"pipeline_update",
            content: (
                <div className="bottom-kanass">
                    {
                        kanassUrl?.systemUrl ?
                        <>
                            <div className='bottom-kanass-url'>
                                <div className='url-label'>系统地址</div>
                                <div className='url-value'>{kanassUrl?.systemUrl}</div>
                            </div>
                            <div className='bottom-kanass-url'>
                                <div className='url-label'>浏览器地址</div>
                                <div className='url-value'>{kanassUrl?.webUrl || '--'}</div>
                            </div>
                            <div className='bottom-kanass-button'>
                                <Button type="primary" className='kanass-button-edit' onClick={()=>setKanassVisible(true)}>
                                    编辑
                                </Button>
                                <Button onClick={delKanassUrl}>
                                    删除
                                </Button>
                            </div>
                        </>
                        :
                        <div className='bottom-kanass-add'>
                            <Button type="primary" onClick={()=>setKanassVisible(true)}>
                                添加Kanass服务
                            </Button>
                        </div>
                    }
                </div>
            )
        },
        {
            key: 'onlyOffice',
            title: "OnlyOffice",
            desc: "OnlyOffice服务地址配置",
            icon: <svg className="icon-16" aria-hidden="true">
                <use xlinkHref='#icon-onlyoffice'></use>
            </svg>,
            content: (
                <div className='bottom-onlyOffice'>
                    {
                        (!disable && OnlyOfficeComponent) ?
                        <OnlyOfficeComponent />
                        :
                        <div className='bottom-onlyOffice-add'>
                            <Button type="primary" onClick={addOnlyOffice}>
                                添加OnlyOffice服务
                            </Button>
                        </div>
                    }
                </div>
            )
        },
    ]

    return (
        <Row className='server'>
            <EnhanceEntranceModal
                visible={archivedFreeVisable}
                setVisible={setArchivedFreeVisable}
                config={{
                    title:'服务集成',
                    desc:'集成OnlyOffice，在线协作办公'
                }}
            />
            <Col xs={{ span: 24 }} xl={{ span: "16", offset: "4" }}>
                <Breadcrumb
                    firstText="服务集成"
                >
                </Breadcrumb>
                <div className="server-ul">
                    {
                        lis.map(item=> (
                            <div key={item.key} className="server-li">
                                <div className={`server-li-top ${isExpandedTree(item.key) ?"server-li-select":"server-li-unSelect"}`}
                                     onClick={()=>setOpenOrClose(item.key)}
                                >
                                    <div className="server-li-icon">{item.icon}</div>
                                    <div className="server-li-center">
                                        <div className="server-li-title">{item.title}</div>
                                        {
                                            !isExpandedTree(item.key) &&
                                            <div className="server-li-desc">{item.desc}</div>
                                        }
                                    </div>
                                    <div className="server-li-down">
                                        { isExpandedTree(item.key)? <DownOutlined />:<RightOutlined /> }
                                    </div>
                                </div>
                                <div className={`${isExpandedTree(item.key)? "server-li-bottom":"server-li-none"}`}>
                                    { isExpandedTree(item.key) && item.content }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <ServerKanassModal
                    visible={kanassVisible}
                    setVisible={setKanassVisible}
                    kanassUrl={kanassUrl}
                    findKanassUrl={findKanassUrl}
                />
            </Col>
        </Row>
    )
}

export default Server;
