/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/4/14
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/14
 */
import React, {Fragment, useState} from "react";
import {Dropdown, Menu} from "antd";
import "./DocumentActionMenu.scss";
import {disableFunction} from 'tiklab-core-ui';
import ArchivedFree from "../../../common/components/archivedFree/ArchivedFree";

const DocumentActionMenu = (props) => {

    const {
        document,commentNum,setShowComment,setValue,documentVersion,setDocumentVersion,
        DocumentVersionAdd,DocumentVersionList,DocumentReviewAdd,exportsWord,updateNode
    } = props;

    const disable = disableFunction();

    //增强功能弹出框
    const [archivedFreeVisable,setArchivedFreeVisable] = useState(false);
    //增强功能而类型
    const [archivedFreeType,setArchivedFreeType] = useState('documentVersion')
    //创建版本弹出框
    const [versionAddVisible,setVersionAddVisible] = useState(false);
    //创建版本弹出框内容
    const [editData,setEditData] = useState(null);
    //查看版本弹出框
    const [versionViewVisible,setVersionViewVisible] = useState(false);
    //重新查询
    const [fresh,setFresh] = useState(false);
    //审批弹出框
    const [reviewAddVisible,setReviewAddVisible] = useState(false);

    /**
     * 文档更多操作
     */
    const selectMoreType = (value) => {
        const {key} = value;
        if(key==='comment'){
            setShowComment(true);
            return;
        }
        if(key==='export-word'){
            if(typeof exportsWord === 'function'){
                exportsWord()
            }
            return;
        }
        if(disable){
            setArchivedFreeVisable(true);
            switch (key) {
                case 'version-add':
                case 'version-view':
                    setArchivedFreeType('documentVersion')
                    break
                case 'review':
                    setArchivedFreeType('documentReview')
            }
            return;
        }
        switch (key) {
            case 'review':
                const nodeStatus = document?.node?.nodeStatus;
                if(nodeStatus===3){
                    if(typeof updateNode === 'function'){
                        updateNode()
                    }
                    return;
                }
                setReviewAddVisible(true);
                return
            case 'version-add':
                setVersionAddVisible(true);
                return;
            case 'version-view':
                setVersionViewVisible(true);
        }
    }

    /**
     * 编辑版本
     */
    const getVersionAddValue = value =>{
        setEditData(value)
        setVersionAddVisible(true)
    }

    /**
     * 刷新
     */
    const getFresh = () =>{
        setFresh(!fresh);
    }

    return (
        <Fragment>
            <Dropdown
                overlay={ documentVersion ?
                    <Menu onClick={(value) => selectMoreType(value)}>
                        <Menu.Item key="version-view">
                            <div className='document-more-actions'>
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-history"></use>
                                </svg>
                                查看版本
                            </div>
                        </Menu.Item>
                    </Menu>
                    :
                    <Menu onClick={(value) => selectMoreType(value)}>
                        {
                            document?.node?.nodeStatus === 2 ? null :
                                <>
                                    <Menu.Item key="review">
                                        <div className='document-more-actions'>
                                            <svg className="document-more-actions-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-commit"></use>
                                            </svg>
                                            {document?.node?.nodeStatus === 3 ? '下线' : '提交评审'}
                                        </div>
                                    </Menu.Item>
                                    <Menu.Divider />
                                </>
                        }
                        <Menu.Item key="version-add">
                            <div className='document-more-actions'>
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-flag"></use>
                                </svg>
                                添加版本
                            </div>
                        </Menu.Item>
                        <Menu.Item key="version-view">
                            <div className='document-more-actions'>
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-history"></use>
                                </svg>
                                查看版本
                            </div>
                        </Menu.Item>
                        {
                            document?.node?.documentType === 'document' &&
                            <>
                                <Menu.Divider />
                                <Menu.Item key="export-word">
                                    <div className='document-more-actions'>
                                        <svg className="document-more-actions-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-history"></use>
                                        </svg>
                                        导出Word
                                    </div>
                                </Menu.Item>
                            </>
                        }
                        <Menu.Divider />
                        <Menu.Item key="comment">
                            <div className='document-more-actions'>
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-comment"></use>
                                </svg>
                                评论
                                <div className='action-comment-num'>
                                    {commentNum}
                                </div>
                            </div>
                        </Menu.Item>
                    </Menu>
                }
                trigger={['click']}
            >
                <svg className="right-icon" aria-hidden="true">
                    <use xlinkHref="#icon-more-default"></use>
                </svg>
            </Dropdown>
            {
                DocumentVersionAdd && (
                    <DocumentVersionAdd
                        document={document}
                        versionAddVisible={versionAddVisible}
                        setVersionAddVisible={setVersionAddVisible}
                        editData={editData}
                        setEditData={setEditData}
                        getFresh={getFresh}
                    />
                )
            }
            {
                DocumentVersionList &&
                <DocumentVersionList
                    document={document}
                    versionViewVisible={versionViewVisible}
                    setVersionViewVisible={setVersionViewVisible}
                    setValue={setValue}
                    documentVersion={documentVersion}
                    setDocumentVersion={setDocumentVersion}
                    getVersionAddValue={getVersionAddValue}
                    fresh={fresh}
                />
            }
            {
                DocumentReviewAdd &&
                <DocumentReviewAdd
                    document={document}
                    visible={reviewAddVisible}
                    setVisible={setReviewAddVisible}
                />
            }
            <ArchivedFree
                type={archivedFreeType}
                archivedFreeVisable={archivedFreeVisable}
                setArchivedFreeVisable={setArchivedFreeVisable}
            />
        </Fragment>
    )
}

export default DocumentActionMenu
