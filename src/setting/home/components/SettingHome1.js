import React, { useEffect, useState } from "react";
import "./SettingHome.scss";
import { Row, Col } from "antd";
import SettingHomeStore from "../store/SettingHomeStore"
import { observer } from "mobx-react";
import { getVersionInfo } from "tiklab-core-ui";
import ArchivedFree from "../../../common/components/ArchivedFree";

const SettingHome = (props) => {
    const { findOrgaNum, selectKey, setSelectKey } = SettingHomeStore;
    const [numList, setNumList] = useState({});
    const authType = JSON.parse(localStorage.getItem("authConfig"))?.authType;
    const versionInfo = getVersionInfo();
    const [archivedFreeVisable, setArchivedFreeVisable] = useState(false)

    useEffect(() => {
        findOrgaNum().then(res => {
            if (res.code === 0) {
                console.log(res.data)
                setNumList(res.data)
            }
        })
    }, [])

    const list = [
        {
            title: '用户与权限',
            key: "user",
            cloudShow: false,
            eeShow: true,
            children: [
                {
                    title: '部门',
                    key: "orga",
                    islink: true,
                    path: '/setting/orga'

                },
                {
                    title: '用户',
                    key: "user",
                    islink: true,
                    path: '/setting/user'
                },
                {
                    title: '用户组',
                    key: "userGroup",
                    islink: true,
                    path: '/setting/userGroup'
                },
                {
                    title: '用户目录',
                    key: "userDir",
                    islink: true,
                    path: '/setting/dir'
                },
                {
                    title: '权限',
                    key: "role",
                    path: '/setting/systemRole'
                }
            ]
        },
        {
            title: '权限',
            key: "user",
            cloudShow: true,
            eeShow: false,
            children: [
                {
                    title: '权限',
                    key: "role",
                    path: '/setting/systemRole'
                }
            ]
        },

        {
            title: '消息',
            key: "message",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '消息通知方案',
                    key: "messageNotice",
                    path: '/setting/messageNotice',
                },
                {
                    title: '消息发送方式',
                    key: "sendType",
                    path: '/setting/messageSendType',
                },
            ]
        },
        {
            title: '系统集成',
            key: "systemIntergrtion",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '地址配置',
                    key: "systemUrl",
                    path: '/setting/urlData',
                },
            ]
        },
        {
            title: '安全',
            key: "security",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '操作日志',
                    key: "logList",
                    noShowNum: true,
                    path: '/setting/log',
                },
                {
                    title: '备份与恢复',
                    key: "backups",
                    noShowNum: true,
                    path: '/setting/backup',
                },
            ]
        },
        {
            title: '应用',
            key: "systemversion",
            cloudShow: false,
            eeShow: true,
            children: [
                {
                    title: '版本与许可证',
                    key: "version",
                    noShowNum: true,
                    path: '/setting/version',
                },
                {
                    title: '应用访问权限',
                    key: "applyAuth",
                    path: '/setting/productAuth',
                },
            ]
        },
        {
            title: '归档知识库',
            key: "archived",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '归档知识库',
                    key: "archived",
                    path: '/setting/archived',
                    isEnhance: true
                },
            ]
        },
        {
            title: '回收站',
            key: "recycle",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '回收站',
                    key: "recycle",
                    path: '/setting/recycle',
                    isEnhance: true,
                },
            ]
        }
    ]

    const goPage = (data) => {

        if (data.islink && !authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig")).authServiceUrl + "#" + data.path;
            window.open(authUrl, '_blank');
        } else if (data.isEnhance) {
            if (versionInfo.expired) {
                setArchivedFreeVisable(true)
            } else {
                props.history.push(data.path)
                setSelectKey(data.path)
            }
        } else {
            props.history.push(data.path)
            setSelectKey(data.path)
        }
    }

    const setVersion = (version) => {
        let data = "";
        if (!version?.expired) {
            data = "企业版"
        } else {
            data = "社区版"
        }
        return data
    }

    return (
        <Row className="setting-home-row">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <div className="setting-home">
                    {
                        list.map(item => {
                            if (item.cloudShow && version === "cloud") {
                                return <div className="setting-home-block" key={item.key}>
                                    <div className="setting-home-block-title">{item.title}</div>
                                    <div className="setting-home-block-content">
                                        {
                                            item.children.map(moduleItem => {
                                                return <div className="setting-home-block-content-item" key={moduleItem.key} onClick={() => goPage(moduleItem)}>
                                                    {
                                                        moduleItem.noShowNum ?
                                                            <div className="module-num"></div>
                                                            :
                                                            <div className="module-num"> {numList[moduleItem.key] ? numList[moduleItem.key] : 0}</div>


                                                    }
                                                    <div className="module-title">{moduleItem.title}
                                                        {
                                                            versionInfo.expired && moduleItem.isEnhance && <svg className="img-icon-16" aria-hidden="true" >
                                                                <use xlinkHref="#icon-member"></use>
                                                            </svg>
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            if (version !== "cloud" && item.eeShow) {
                                return <div className="setting-home-block" key={item.key}>
                                    <div className="setting-home-block-title">{item.title}</div>
                                    <div className="setting-home-block-content">
                                        {
                                            item.children.map(moduleItem => {
                                                return <div className="setting-home-block-content-item" key={moduleItem.key} onClick={() => goPage(moduleItem)}>
                                                    {
                                                        moduleItem.noShowNum ?
                                                            <div className="module-num"></div>
                                                            :
                                                            <div className="module-num"> {numList[moduleItem.key] ? numList[moduleItem.key] : 0}</div>


                                                    }
                                                    <div className="module-title">
                                                        {moduleItem.title}
                                                        {
                                                            versionInfo.expired && moduleItem.isEnhance && <svg className="img-icon-16" aria-hidden="true" >
                                                                <use xlinkHref="#icon-member"></use>
                                                            </svg>
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }

                        })
                    }
                </div>
                <ArchivedFree
                    archivedFreeVisable={archivedFreeVisable}
                    setArchivedFreeVisable={setArchivedFreeVisable}
                />
            </Col>
        </Row>

    )
}
export default observer(SettingHome);