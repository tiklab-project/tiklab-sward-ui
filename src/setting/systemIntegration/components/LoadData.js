/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-10-13 16:54:17
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:47:55
 */
import React, { Fragment, useEffect, useState } from "react";
import { Upload, message, Button, Row, Col, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./LoadData.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { getUser } from 'tiklab-core-ui';
import { observer } from "mobx-react";
import UrlDataStore from "../store/UrlDataStore";

const LoadData = (props) => {
    const { findCfInputSchedule } = UrlDataStore;
    const ticket = getUser().ticket;
    const [currentSchedule, setCurrentSchedule] = useState({ currentNum: 0, wikiRepository: null, total: 0 })
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false)
    let [timer, setTimerS] = useState()
    // let timer;
    useEffect(() => {
        return () => clearInterval(timer)
    }, [])

    const getJiraInputSchedule = () => {
        findCfInputSchedule().then(res => {
            if (res.code === 0) {
                currentSchedule.wikiRepository = res.data.wikiRepository ? res.data.wikiRepository : null;
                currentSchedule.total = res.data.total ? res.data.total : 0;
                currentSchedule.currentNum = res.data.currentNum ? res.data.currentNum : 0;
                if (res.data.total && res.data.currentNum) {
                    const rr = res.data.currentNum * 100 / res.data.total;
                    setPercent(rr);
                    
                }
                if (res.data.status === 1) {
                    clearInterval(timer);
                    setLoading(false)
                    message.success("导入成功")
                } 
                if(res.data.status === 2){
                    clearInterval(timer);
                    setLoading(false)
                    message.error("导入失败")
                }
                // setPercent(3 / 10);
                setCurrentSchedule(currentSchedule)
            }
        })
    }
    const uploadProps = {
        name: 'uploadFile',
        action: `${upload_url}/importData/importConfluenceData`,
        headers: {
            ticket: ticket,
            tenant: getUser().tenant && version === "cloud" ? getUser().tenant : null
        },
        progress: {
            strokeWidth: 0,
            showInfo: false
        },
        showUploadList: false,
        maxCount: 1,
        onChange(info) {
            if (info.event) {
                clearInterval(timer)
                setLoading(true)
                timer = setInterval(() => getJiraInputSchedule(), 2000)
                setTimerS(timer)
            }
            if (info.file.status === "done") {
                
                setTimerS(null)
               
            }

        },
    };

    return (
        <div className="load">
            <Breadcumb
                firstText="Confluence集成"
            />
            <div className="load-jira">
                <div>从本地文件导入Confluence数据</div>
                <div className="load-box">
                    上传zip包：
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>导入cf数据</Button>
                    </Upload>
                </div>
                {
                    loading && <div className="load-precess">
                        <Progress percent={percent} showInfo={false} />
                        <div className="load-precess-text"> 当前解析知识库：<span className="load-precess-name">{currentSchedule.wikiRepository?.name}</span>  <span>{currentSchedule.currentNum} / {currentSchedule.total}</span></div>
                    </div>
                }
            </div>
        </div>
        //     </Col>
        // </Row>
    )
}

export default observer(LoadData);