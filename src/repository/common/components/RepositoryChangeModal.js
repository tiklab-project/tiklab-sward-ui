import React, { useEffect, useRef, useState } from "react";
import "./RepositoryChangeModal.scss";
import { withRouter } from "react-router";
import RepositoryDetailStore from "../store/RepositoryDetailStore";
import { observer } from "mobx-react";
import { getUser } from "thoughtware-core-ui";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import { Tooltip } from "antd";

const RepositoryChangeModal = (props) => {
    const { isShowText, theme } = props;
    const [showMenu, setShowMenu] = useState(false);
    const [selectRepository, setSelectRepository] = useState(false)
    const { findRecentRepositoryList, getAllRepositorylist, allRepositorylist, searchRepository } = RepositoryDetailStore;
    const [showRepositoryList, setShowRepositoryList] = useState();
    const [repository, setRepository] = useState()
    const userId = getUser().useId;
    const modelRef = useRef()
    const setButton = useRef()
    const repositoryId = props.match.params.repositoryId;
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        const params = {
            master: userId,
            repositoryId: repositoryId
        }
        getAllRepositorylist()
        findRecentRepositoryList(params).then(res => {
            if (res.code === 0) {
                setShowRepositoryList(res.data.slice(0, 5))
            }
        })
        modelRef.current.style.left = setButton.current.clientWidth
    }

    useEffect(() => {
        searchRepository(repositoryId).then(res => {
            if (res.code === 0) {
                setRepository(res.data)
            }
        })
    }, [])

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
        // 切换选中项目，获取项目详情
        searchRepository(id).then(data => {
            if (data.code === 0) {
                props.history.push(`/repository/${id}/overview`)
                // 重置事项id
                // 关闭切换弹窗
                setShowMenu(false)
                location.reload();
            }
        });
        // 讲当前项目id存入localStorage
    }

    const handleMouseOver = (id) => {
        setSelectRepository(id)
    }

    const handleMouseOut = () => {
        setSelectRepository("")
    }

    return (
        <div className="change-repository">
            <div ref={setButton}>
                {
                    isShowText ? <div className="repository-title title" onClick={showMoreMenu}>
                        {
                            repository?.iconUrl && <ImgComponent
                                src={repository?.iconUrl}
                                className="icon-24"
                                alt=""
                            />
                        }

                        <div className={`repository-text `} >
                            <div className='name'>
                                {repository?.limits}
                            </div>
                            <div className='type'>
                                {repository?.projectType?.name}
                            </div>
                        </div>
                        <div className={`repository-toggleCollapsed`}>
                            <svg className="icon-15" aria-hidden="true">
                                <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                            </svg>
                        </div>
                    </div>
                        :
                        <Tooltip placement="right" title={repository?.name}>
                            <div className='repository-title-icon' onClick={showMoreMenu} >
                                {
                                    repository?.iconUrl && <ImgComponent
                                        src={repository?.iconUrl}
                                        title={repository?.name}
                                        // alt={repository?.projectName}
                                        className="icon-32"
                                    />
                                }

                                {/* <div className={`repository-toggleCollapsed`}>
                                <svg className="icon-15" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                </svg>
                            </div> */}
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
                        onMouseOver={() => handleMouseOver(repository.id)}
                        onMouseOut={handleMouseOut}

                    >
                        <ImgComponent
                            src={repository.iconUrl}
                            alt=""
                            className="list-img"
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
                        return <div className={`change-repository-item ${item.id === selectRepository ? "change-repository-selectItem" : ""}`}
                            onClick={() => selectRepositoryId(item.id)}
                            key={item.id}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={handleMouseOut}

                        >
                            <ImgComponent
                                src={item.iconUrl}
                                alt=""
                                className="list-img"
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
                {
                    allRepositorylist.length > 6 && <div className="change-repository-more" onClick={() => props.history.push("/repository")}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(observer(RepositoryChangeModal));