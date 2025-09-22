/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-10-13 16:54:17
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:47:55
 */
import React, {useEffect, useRef, useState} from "react";
import {Upload, message, Button, Row, Col, Steps, Spin, Table} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./Confluence.scss";
import Breadcumb from "../../../../common/components/breadcrumb/Breadcrumb";
import { getUser,getAPIgateway } from 'tiklab-core-ui';
import { observer } from "mobx-react";
import confluenceStore from "../store/ConfluenceStore";

const Confluence = (props) => {

    const { findCfInputSchedule,validConfluenceVersion,analysisEntityXml,importJiraData } = confluenceStore;

    const user = getUser();
    const scrollRef = useRef(null);

    //日志滚动条
    const [isActiveSlide,setIsActiveSlide] = useState(true);
    //加载
    const [spinning,setSpinning] = useState(false);
    //导入后获取文件信息加载
    const [fileSpinning,setFileSpinning] = useState(false);
    //当前步骤
    const [current,setCurrent] = useState(0);
    //效验文件
    const [validCfInput,setValidCfInput] = useState(null);
    //解析文件
    const [entityXml,setEntityXml] = useState([]);
    //导入信息
    const [schedule,setSchedule] = useState({});

    const runInterRef = useRef(null);

    useEffect(() => {
        return () =>{
            clearInterval(runInterRef.current)
        }
    }, [])

    const uploadProps = {
        name: 'uploadFile',
        action: `${upload_url}/import/confluence/uploadFile`,
        headers: {
            ticket: user.ticket,
            tenant: version === "cloud" ? user.tenant : null,
            ...getAPIgateway()
        },
        progress: {
            strokeWidth: 0,
            showInfo: false
        },
        showUploadList: false,
        maxCount: 1,
        onChange(info) {
            setSpinning(true);
            const {file} = info;
            if (file.status === 'done') {
                const response = file.response;
                if(response?.code===0){
                    setCurrent(1);
                    const value = new FormData();
                    setFileSpinning(true);
                    value.append('confluenceFileAddress',response.data);
                    validConfluenceVersion(value).then(res=>{
                        if(res.code===0){
                            setValidCfInput(res.data)
                        }
                    }).finally(()=>setFileSpinning(false))
                } else {
                    message.error(response.msg)
                }
                setSpinning(false);
            }
            if(file.status==='error'){
                message.error('上传失败')
                setSpinning(false);
            }
        },
    };

    /**
     * 解析文件
     */
    const analysis = () =>{
        setCurrent(2);
        setSpinning(true);
        const value = new FormData();
        value.append('confluenceAddress',validCfInput.path);
        analysisEntityXml(value).then(res=>{
            if(res.code===0){
                setEntityXml(res.data)
            } else {
                message.error(res.msg)
            }
        }).finally(()=>setSpinning(false))
    }

    /**
     * 开始导入
     */
    const importCf = () =>{
        setCurrent(3);
        const value = new FormData();
        value.append('confluenceFileAddress',validCfInput.path);
        importJiraData(value).then(res=>{
            if(res.code===0){
            } else {
                message.error(res.msg)
            }
        })
        findCfSchedule()
    }

    const findCfSchedule = () => {
        clearInterval(runInterRef.current);
        runInterRef.current = setInterval(()=>{
            findCfInputSchedule().then(res => {
                if (res.code === 0) {
                    const data = res.data
                    setSchedule(data);
                    if(data?.status!=='run'){
                        clearInterval(runInterRef.current)
                    }
                    if(data.status==='success'){
                        message.success('导入成功')
                    }
                    if(data.status==='error'){
                        message.error('导入失败')
                    }
                } else {
                    message.error(res.msg);
                    clearInterval(runInterRef.current)
                }
            }).catch(()=>{
                clearInterval(runInterRef.current)
            })
        },1000)
    }


    let startScrollTop  = 0;

    /**
     * 鼠标滚轮滑动事件
     */
    const onWheel = () => {
        if(!isActiveSlide) return
        setIsActiveSlide(false)
    }


    /**
     * 鼠标左键事件获取内容区域初始滚动位置
     * @param e
     */
    const handleMouseDown = e =>{
        if(e.button===0){
            if(!isActiveSlide) return
            startScrollTop =  scrollRef.current.scrollTop;
        }
    }

    /**
     * 结束滚动位置
     * @param e
     */
    const handleMouseUp = e => {
        if(e.button===0){
            if(!isActiveSlide) return
            const endScrollTop = scrollRef.current.scrollTop;
            if(startScrollTop !== endScrollTop) {
                setIsActiveSlide(false)
            }
        }
    }

    const steps = [
        '上传文件',
        '效验版本',
        '解析文件',
        '开始导入',
    ]

    const exportType = {
        'space':'空间',
        'site':'站点',
        'all':'全部',
        'defalut':'其他'
    }

    /**
     * 导出类型
     * @returns {*}
     */
    const exportTypeHtml = () => {
        const type = validCfInput?.exportType || 'defalut';
        return exportType[type];
    }

    return (
        <Row className="confluence">
            <Col
                xxl={{ span: 16, offset: 4 }}
                xl={{ span: 18, offset: 3 }}
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                className='sward-home-limited'
            >
                <Breadcumb firstText="Confluence导入"/>
                <div className='confluence-steps'>
                    <Steps current={current}>
                        {steps.map(title => (
                            <Steps.Step key={title} title={title} />
                        ))}
                    </Steps>
                </div>
                {
                    current === 0 &&
                    <Spin spinning={spinning} tip={'导入中.'}>
                        <div className="confluence-upload">
                            上传zip包：
                            <Upload {...uploadProps} >
                                <Button icon={<UploadOutlined />}>导入Confluence数据</Button>
                            </Upload>
                        </div>
                    </Spin>
                }
                {
                    current === 1 &&
                    <Row>
                        <Col
                            xl={{ span: 14, offset: 5 }}
                            xs={{ span: 18, offset: 3 }}
                        >
                            <Spin spinning={fileSpinning}>
                                <div className='confluence-valid-version'>
                                    <div className='valid-version'>
                                        <div>文件</div>
                                        <div>{validCfInput?.fileName}</div>
                                    </div>
                                    <div className='valid-version'>
                                        <div>版本</div>
                                        <div>{validCfInput?.versionNumber}</div>
                                    </div>
                                    <div className='valid-version'>
                                        <div>导出类型</div>
                                        <div>{exportTypeHtml()}</div>
                                    </div>
                                    <div className='valid-version'>
                                        <div>服务类型</div>
                                        <div>{validCfInput?.serverType==='server'?'server版本':'其他版本'}</div>
                                    </div>
                                    <div className='valid-version'>
                                        <div>构建号</div>
                                        <div>{validCfInput?.buildNumber}</div>
                                    </div>
                                    <div className='valid-version'>
                                        <div>是否支持导入</div>
                                        <div>{validCfInput?.support ? '支持':'不支持'}</div>
                                    </div>
                                    <div className='valid-version-button'>
                                        <Button onClick={()=>setCurrent(0)}>
                                            上一步
                                        </Button>
                                        {
                                            validCfInput?.support ?
                                                <Button type={'primary'} onClick={analysis}>
                                                    解析文件
                                                </Button>
                                                :
                                                <Button disabled>
                                                    解析文件
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                }
                {
                    current === 2 &&
                    <Spin spinning={spinning}>
                        <div className='confluence-entity-xml'>
                            <Table
                                columns={[
                                    {
                                        title: "空间名称",
                                        dataIndex: "name",
                                        key: "name",
                                        width: "35%",
                                        ellipsis: true,
                                    },
                                    {
                                        title: "文档数量",
                                        dataIndex: "pageList",
                                        key: "pageList",
                                        width: "30%",
                                        ellipsis: true,
                                        render: text => text?.length ? text.length : 0
                                    },
                                    {
                                        title: "创建时间",
                                        dataIndex: "createTime",
                                        key: "createTime",
                                        width: "35%",
                                        ellipsis: true,
                                    },
                                ]}
                                dataSource={entityXml}
                                rowKey={record => record.id}
                                pagination={false}
                            />
                            <div className='entity-xml-button'>
                                <Button onClick={()=>setCurrent(1)}>
                                    上一步
                                </Button>
                                <Button type={'primary'} onClick={importCf}>
                                    开始导入
                                </Button>
                            </div>
                        </div>
                    </Spin>
                }
                {
                    current === 3 &&
                    <div
                        className='confluence-import'
                        ref={scrollRef}
                        onWheel={onWheel}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        {(() => {
                            if(scrollRef.current && isActiveSlide){
                                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                            }
                            return schedule?.message || '开始导入'
                        })()}
                    </div>
                }
            </Col>
        </Row>
    )
}

export default observer(Confluence);
