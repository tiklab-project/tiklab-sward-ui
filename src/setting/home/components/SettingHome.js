// 弃用
import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import SettingHomeStore from "../store/SettingHomeStore";
import { applyJump, disableFunction, applySubscription, getUser, getVersionInfo } from "tiklab-core-ui";
import versionStore from "tiklab-licence-ui/es/version/VersionStore";
// import overviewStore from "../../../pipeline/overview/store/OverviewStore";
import vipDark from '../../../assets/images/vip-one.png';
import  vipLight from '../../../assets/images/vip-two.png';
import "./SettingHome.scss";
import moment from "moment";
import {
    ApartmentOutlined,
    UserOutlined,
    MessageOutlined,
    GroupOutlined,
    ScheduleOutlined,
    InsertRowBelowOutlined,
    IdcardOutlined,
    ConsoleSqlOutlined,
    VerifiedOutlined,
    ToolOutlined,
    AlertOutlined,
    CloudOutlined,
    NodeIndexOutlined,
    HourglassOutlined,
    InboxOutlined,
    ShoppingOutlined,
    RightOutlined,
    MacCommandOutlined,
    MergeCellsOutlined,
    FileProtectOutlined,
    HistoryOutlined,
    LaptopOutlined, DeleteOutlined,
} from "@ant-design/icons"
import ArchivedFree from "../../../common/components/archivedFree/ArchivedFree";

const SettingHome = props => {
    const {cloudVersion, setBackupVisible} = props;
    const { findOrgaNum, findlogpage, setExpandedTree, expandedTree } = SettingHomeStore;
    const { findUseLicence } = versionStore;
    const versionInfo = getVersionInfo();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false);
    const authType = JSON.parse(localStorage.getItem("authConfig"))?.authType;
    //系统设置统计数据
    const [count, setCount] = useState({});
    //当前版本
    const [licence, setLicence] = useState(null);
    //操作日志
    const [log, setLog] = useState(null);

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    const setOpenOrClose = key => {
        if (!isExpandedTree(key)) {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const select = (data) => {
        const id = data.id;
        const iseEnhance = data.iseEnhance;
        if(version === "cloud") {
            if(data.islink){
                window.open(workUrl + "#" + data.id, '_blank');
            }else {
                if (versionInfo.expired === false) {
                    props.history.push(id)
                    setOpenOrClose(data.parentUrl)
                } else {
                    if (!iseEnhance) {
                        props.history.push(id)
                        setOpenOrClose(data.parentUrl)
                    } else {
                        if(id === "/setting/backup"){
                            setBackupVisible(true)
                        }else {
                            setArchivedFreeVisable(true)
                        }

                    }
                }

            }
        }else {
            if (data.islink && !authType) {
                const authUrl = JSON.parse(localStorage.getItem("authConfig"))?.authServiceUrl + "#" + data.id;
                window.open(authUrl, '_blank');
            } else {
                if (versionInfo.expired === false) {
                    props.history.push(id)
                } else {
                    if (!iseEnhance) {
                        props.history.push(id)
                    } else {
                        setArchivedFreeVisable(true)
                    }
                }

            }
            setOpenOrClose(data.parentUrl)
        }


    }

    const array = [
        {
            title: "用户与权限",
            id: 1,
            children: [
                {
                    title: '用户',
                    id: version === "cloud" ? '/enterprise/user':'/setting/user',
                    parentUrl: '/setting/orga',
                    icon: <UserOutlined />,
                    islink: true,
                    num: count?.user || 0
                },
                {
                    title: "部门",
                    id: version === "cloud" ? '/enterprise/orga':'/setting/orga',
                    islink: true,
                    parentUrl: '/setting/orga',
                    icon: <ApartmentOutlined />,
                    num: count?.orga
                },

                {
                    title: '用户组',
                    id: version === "cloud" ? '/enterprise/userGroup':'/setting/userGroup',
                    parentUrl: '/setting/orga',
                    islink: true,
                    icon: <GroupOutlined />,
                    num: count?.userGroup || 0
                },
                {

                    title: "用户目录",
                    id: version === "cloud" ? '/enterprise/dir':'/setting/dir',
                    parentUrl: '/setting/orga',
                    islink: true,
                    icon: <IdcardOutlined />,
                    num: count?.userDir || 0
                },
                {
                    title: '权限',
                    id: "/setting/systemRole",
                    parentUrl: '/setting/orga',
                    icon: <ScheduleOutlined />,
                    num: count?.role || 0
                }
            ]
        },
        {
            title: "消息",
            id: 2,
            children: [
                {
                    title: "消息通知方案",
                    id: '/setting/messageNotice',
                    parentUrl: '/setting/messageNotice',
                    icon: <svg className="icon-15" aria-hidden="true">
                        <use xlinkHref={`#icon-systemmessage`}></use>
                    </svg>,
                    num: count?.messageNotice || 0
                },
                {
                    title: '消息发送方式',
                    id: '/setting/messageSendType',
                    parentUrl: '/setting/messageNotice',
                    icon: <AlertOutlined />,
                    num: count?.sendType || 0
                }
            ]
        },
        {
            title: "数据安全",
            id: 3,
            children: [
                {
                    title: "上次备份",
                    id: '/setting/backup',
                    parentUrl: '/setting/log',
                    iseEnhance: version === "cloud" ? true : false,
                    icon: <HistoryOutlined />,
                    num: count?.lastBackups && moment(count.lastBackups).format('MM-DD') || '无'
                },
                {
                    title: '操作日志',
                    id: '/setting/log',
                    parentUrl: '/setting/log',
                    icon: <InsertRowBelowOutlined />,
                    num: log?.totalRecord || '0'
                },
                {
                    title: '回收站',
                    id: '/setting/recycle',
                    iseEnhance: true,
                    icon: <svg className="icon-15" aria-hidden="true">
                        <use xlinkHref={`#icon-systemrecycle`}></use>
                    </svg>,
                    num: count?.recycle || 0
                },
            ]
        },
    ]
    useEffect(() => {
        findOrgaNum().then(res => {
            if (res.code === 0) {
                setCount(res.data)
            }
        })
        if (version === 'cloud') {
            findlogpage({
                pageParam: { pageSize: 1, currentPage: 1 },
                userId: getUser().userId
            }).then(res => {
                if (res.code === 0) {
                    setLog(res.data)
                }
            })
        } else {
            findUseLicence().then(res => {
                if (res.code === 0) {
                    setLicence(res.data)
                }
            })
        }
    }, [])

    const goAuth = () => {
        props.history.push(`/setting/productAuth`)
    }

    const showProductInfo = () =>{
        return{
            expired:getVersionInfo()?.expired,
            time: licence?.issuedTime,
            authUser: count.applyAuth,
            userNum: licence?.userNum||0
        }
    }

    return (
        <Row className='setting-home'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "18", offset: "3" }}
                xl={{ span: "14", offset: "5" }}
                xxl={{ span: "14", offset: "5" }}
            >
                <div className='setting-home-limited'>
                    {
                        version === "cloud" ? <>
                            <div className='home-licence-box'>
                                {cloudVersion}
                            </div>
                            <div className='home-chunk-box'>
                                {
                                    array.map((item, index) => {
                                        return (
                                            <div className='home-user-box' key={index}>
                                                <div className='home-title'>{item.title}</div>
                                                <div className='home-user'>
                                                    {
                                                        item.children.map(childrenItem => {
                                                            return <div className='home-user-item' onClick={() => select(childrenItem)} key={childrenItem.id}>
                                                                <div className='home-icon'>
                                                                    {childrenItem.icon}
                                                                </div>
                                                                <div className='home-label'>
                                                                    {childrenItem.title}
                                                                    {
                                                                        childrenItem.iseEnhance && versionInfo.expired === true && <svg className="img-icon-16" aria-hidden="true" >
                                                                            <use xlinkHref="#icon-member"></use>
                                                                        </svg>
                                                                    }
                                                                </div>
                                                                <div className='home-info'>
                                                                    {childrenItem.num}
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </>
                            :
                            <>
                               <div className='home-licence-box'>
                                    <div className='home-licence'>
                                        <div className='home-licence-item'>
                                            <div className='home-licence-item-level'>
                                                <div className='licence-level-img'>
                                                    <img src={disableFunction() ? vipDark : vipLight } alt={''} />
                                                </div>
                                                <div>
                                                    <div>
                                                        <span className='licence-level-info'>{disableFunction() ? '社区版' : '企业版'}</span>
                                                        {licence?.issuedTime &&
                                                            <span className='licence-level-issuedTime'>
                                                                {moment(licence.issuedTime).format('YYYY-MM-DD HH:mm:ss')}到期
                                                            </span>}
                                                    </div>
                                                    <div className='licence-level-applyAuth'>
                                                        <span className='licence-level-applyAuth-title'>授权人数：</span>
                                                        <span className='licence-level-info licence-level-click' onClick={()=> goAuth()}>
                                                        {showProductInfo()?.authUser } / {showProductInfo()?.expired ? "不限制" : showProductInfo()?.userNum > 0 ? showProductInfo().userNum+'人' : "不限制"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='home-licence-sub' onClick={() => applySubscription('sward')}>
                                            {count?.version ? '订阅' : '续订'}
                                        </div>
                                    </div>
                                </div>
                                <div className='home-chunk-box'>
                                    {
                                        array.map((item, index) => {
                                            return (
                                                <div className='home-user-box' key={index}>
                                                    <div className='home-title'>{item.title}</div>
                                                    <div className='home-user'>
                                                        {
                                                            item.children.map(childrenItem => {
                                                                return <div className='home-user-item' onClick={() => select(childrenItem)} key={childrenItem.id}>
                                                                    <div className='home-icon'>
                                                                        {childrenItem.icon}
                                                                    </div>
                                                                    <div className='home-label'>
                                                                        {childrenItem.title}
                                                                        {
                                                                            childrenItem.iseEnhance && versionInfo.expired === true && <svg className="img-icon-16" aria-hidden="true" >
                                                                                <use xlinkHref="#icon-member"></use>
                                                                            </svg>
                                                                        }
                                                                    </div>
                                                                    <div className='home-info'>
                                                                        {childrenItem.num}
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                    }
                </div>
                <ArchivedFree
                    archivedFreeVisable={archivedFreeVisable}
                    setArchivedFreeVisable={setArchivedFreeVisable}
                />
            </Col>
        </Row>
    )
};

export default SettingHome;
