/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 14:57:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:05:41
 * @Description: 知识库添加详情
 */
import React, { Fragment, useEffect } from "react";
import { Form, Input, message, Upload } from 'antd';
import "./repositoryAddInfo.scss";
import Button from "../../../common/components/button/Button";
import { useState } from "react";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import Img from "../../../common/components/img/Img";
const { TextArea } = Input;

const layout = {
    labelCol: {
        span: 6,
    }
};


const RepositoryAddInfo = (props) => {
    const { addRepositorylist, repositoryStore } = props;
    const [form] = Form.useForm();
    const [iconUrl, setIconUrl] = useState("repository1.png")
    const [iconList, setIconList] = useState();
    const { findIconList, creatIcon } = repositoryStore;

    useEffect(() => {
        getIconList()
        return;
    }, [])

    const getIconList = () => {
        findIconList({ iconType: "repository" }).then((res) => {
            setIconList(res.data)
            setIconUrl(res.data[0]?.iconUrl)
        })
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            const data = {
                name: values.name,
                desc: values.desc,
                limits: values.limits,
                iconUrl: iconUrl
            }
            addRepositorylist(data).then(res => {
                if (res.code === 40000) {
                    message.error(res.msg);
                }
                if (res.code === 0) {
                    message.success('添加成功');;
                    // findRepositoryList({masterId: userId})
                    props.history.push(`/repository/${res.data}/overview`)
                }
            })
        })
    }

    const checkLimit = (_, value) => {
        console.log(value)
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };

    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status === 'done') {
                console.log(info.file, info.fileList);
                const res = info.file.response.data;
                const params = {
                    iconName: info.file.name,
                    iconUrl: "/image/" + res,
                    iconType: "repository"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    }
                })
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };
    const [limtValue, setLimitValue] = useState("0");
    const LimitComponents = ({ value = {}, onChange }) => {

        const changeLimit = (id) => {
            setLimitValue(id)
            onChange(id)
        }

        return (
            <div className="repository-limit" onChange={onChange} value={value}>
                <div key="0" className={`repository-limits ${limtValue === "0" ? "limit-select" : ""}`} onClick={() => changeLimit("0")}>
                    <div className="limits-title">
                        公共
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-publish"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        公共知识库，全部成员可见
                    </div>
                </div>
                <div key="1" className={`repository-limits ${limtValue === "1" ? "limit-select" : ""}`} onClick={() => changeLimit("1")}>
                    <div className="limits-title">
                        私密
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-private"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        私密知识库，只有知识库成员可见
                    </div>
                </div>
            </div>
        )
    }


    return (
        <Fragment>
            <div className="repository-addinfo">
                {/* <div className="repository-type-head">填写信息</div> */}
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                        limits: "0"
                    }}
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="知识库名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '使用中英文、数字、空格组合',
                            },
                        ]}
                    >
                        <Input placeholder="使用中英文、数字、空格组合" />
                    </Form.Item>

                    <Form.Item
                        label="可见范围"
                        name="limits"
                        rules={[
                            {
                                validator: checkLimit,
                            }
                        ]}
                    >
                        <LimitComponents />
                    </Form.Item>
                    <Form.Item
                        label="知识库描述"
                        name="desc"
                        rules={[
                            {
                                required: false,
                                message: '请输入知识库描述',
                            },
                        ]}
                    >
                        <TextArea rows={3} placeholder="知识库描述" />
                    </Form.Item>
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="repository-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div
                                        key={item.id}
                                        className={`repository-icon  ${item.iconUrl === iconUrl ? "icon-select" : null}`}
                                        onClick={() => { setIconUrl(item.iconUrl) }}
                                    >
                                        <Img
                                            src={item.iconUrl}
                                            alt="" className="img-icon"
                                        />
                                    </div>
                                })
                            }
                            {/* <Upload {...upLoadIcon}>
                                <div className="project-icon">
                                    <img src={UploadIcon1} alt="" className="list-img" />
                                </div>
                            </Upload> */}
                        </div>


                    </Form.Item>
                    <div className="repository-add-submit">
                        <Button htmlType="button" onClick={() => props.history.goBack()}>
                            取消
                        </Button>

                        <Button type="primary" htmlType="submit" onClick={onFinish}>
                            提交
                        </Button>
                    </div>
                </Form>
            </div>
        </Fragment>

    )
}
export default inject("repositoryStore")(withRouter(observer(RepositoryAddInfo)));
