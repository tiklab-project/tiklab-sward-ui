/*
 * @Descripttion: 切换知识库弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-03 15:21:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:29:36
 */
import React, { useEffect, useRef, useState } from "react";
import "./RepositoryChangeModal.scss";
import { withRouter } from "react-router";
import RepositoryDetailStore from "../store/RepositoryDetailStore";
import { observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import Img from "../../../common/components/img/Img";
import { Tooltip } from "antd";
import ListIcon from "../../../common/components/icon/ListIcon";
import {DownOutlined} from "@ant-design/icons";

const RepositoryChangeModal = (props) => {

    const { isShowText, theme } = props;

    const { findRecentRepositoryList, repository } = RepositoryDetailStore;

    //是否展开
    const [showMenu, setShowMenu] = useState(false);
    //知识库
    const [showRepositoryList, setShowRepositoryList] = useState();

    const userId = getUser().useId;
    const modelRef = useRef(null);
    const setButton = useRef(null);
    const repositoryId = props.match.params.repositoryId;

    // 显示切换弹窗
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        findRecentRepositoryList({
            master: userId,
            repositoryId: repositoryId
        }).then(res => {
            if (res.code === 0) {
                setShowRepositoryList(res.data.slice(0, 4))
            }
        })
        modelRef.current.style.left = setButton.current.clientWidth
    }

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    /**
     * 切换项目
     * @param {id} id
     */
    const selectRepositoryId = (id) => {
        props.history.push(`/repository/${id}/overview`)
        setShowMenu(false)
        location.reload();
    }

    return (
        <div className="change-repository">
            <div ref={setButton}>
                {
                    isShowText ? <div className="repository-title title" onClick={showMoreMenu}>
                        {
                            repository?.iconUrl &&
                            <ListIcon
                                icon={repository?.iconUrl}
                                text={repository?.name}
                                isMar={false}
                            />
                        }
                        <div className="repository-text">
                            <div className='name' title={repository?.name}>
                                {repository?.name}
                            </div>
                        </div>
                        <div style={{opacity:0.8,fontSize:12}}>
                            <DownOutlined />
                        </div>
                        </div>
                    :
                    <Tooltip placement="right" title={repository?.name}>
                        <div className='repository-title-icon' onClick={showMoreMenu} >
                            {
                                repository?.iconUrl && <ListIcon
                                    icon={repository?.iconUrl}
                                    text={repository?.name}
                                    isMar={false}
                                />
                            }
                        </div>
                    </Tooltip>
                }
            </div>
            <div className={`change-repository-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-repository-head">选择知识库</div>
                {
                    repository && <div className={`change-repository-item change-repository-selectItem`}
                        onClick={() => selectRepositoryId(repository?.id)}
                        key={repository.id}
                    >

                        <ListIcon
                            icon={repository?.iconUrl}
                            text={repository?.name}
                        />
                        <div className="item-info">
                            <div className="item-name">
                                {repository.name}
                            </div>
                            <div className="item-master">
                                {repository.master.name}
                            </div>
                        </div>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-selected"></use>
                        </svg>
                    </div>
                }
                {
                    showRepositoryList && showRepositoryList.map((item) => {
                        return <div className="change-repository-item"
                            onClick={() => selectRepositoryId(item.id)}
                            key={item.id}
                        >
                            <ListIcon
                                icon={item?.iconUrl}
                                text={item?.name}
                            />
                            <div className="item-info">
                                <div className="item-name">
                                    {item.name}
                                </div>
                                <div className="item-master">
                                    {item.master.name}
                                </div>
                            </div>
                        </div>
                    })
                }
                <div className="change-repository-more" onClick={() => props.history.push("/repository")}>
                    查看更多
                </div>
            </div>
        </div>
    )
}
export default withRouter(observer(RepositoryChangeModal));
