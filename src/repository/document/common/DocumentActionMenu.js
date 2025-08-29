/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/4/14
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/14
 */
import React, {Fragment, useState} from "react";
import {Divider, Dropdown} from "antd";
import "./DocumentActionMenu.scss";
import {disableFunction} from 'tiklab-core-ui';
import EnhanceEntranceModal from "../../../common/components/modal/EnhanceEntranceModal";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

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
    //下拉框
    const [dropdownVisible,setDropdownVisible] = useState(false);

    /**
     * 文档更多操作
     */
    const selectMoreType = (key) => {
        setDropdownVisible(false);
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

    const configEnhance = {
        'documentVersion':{
            title:'版本',
            desc: '提供文档全生命周期的版本控制能力'
        },
        'documentReview':{
            title:'评审',
            desc:'规范和管理文档的发布流程'
        },
    }

    return (
        <Fragment>
            <Dropdown
                visible={dropdownVisible}
                onVisibleChange={visible => {
                    setDropdownVisible(visible);
                }}
                overlay={ documentVersion ?
                    <div className='sward-dropdown-more'>
                        <PrivilegeProjectButton domainId={document?.repositoryId} code={disable ? null:'wi_doc_find_version'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('version-view')}
                            >
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-history"></use>
                                </svg>
                                查看版本
                            </div>
                        </PrivilegeProjectButton>
                    </div>
                    :
                    <div className='sward-dropdown-more'>
                        {
                            document?.node?.nodeStatus === 2 ? null :
                                <>
                                    <PrivilegeProjectButton
                                        domainId={document?.repositoryId}
                                        code={
                                            disable ? null :
                                            document?.node?.nodeStatus === 3 ? 'wi_doc_offline' : 'wi_doc_commit_review'
                                        }
                                    >
                                        <div
                                            className='document-more-actions dropdown-more-item'
                                            onClick={() => selectMoreType('review')}
                                        >
                                            <svg className="document-more-actions-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-commit"></use>
                                            </svg>
                                            {document?.node?.nodeStatus === 3 ? '下线' : '提交评审'}
                                        </div>
                                    </PrivilegeProjectButton>
                                    <Divider />
                                </>
                        }
                        <PrivilegeProjectButton domainId={document?.repositoryId} code={disable ? null:'wi_doc_add_version'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('version-add')}
                            >
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-flag"></use>
                                </svg>
                                添加版本
                            </div>
                        </PrivilegeProjectButton>
                        <PrivilegeProjectButton domainId={document?.repositoryId} code={disable ? null:'wi_doc_find_version'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('version-view')}
                            >
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-history"></use>
                                </svg>
                                查看版本
                            </div>
                        </PrivilegeProjectButton>
                        {
                            document?.node?.documentType === 'document' &&
                            <>
                                <Divider />
                                <PrivilegeProjectButton domainId={document?.repositoryId} code={'wi_doc_import_word'}>
                                    <div
                                        className='document-more-actions dropdown-more-item'
                                        onClick={() => selectMoreType('export-word')}
                                    >
                                        <svg className="document-more-actions-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-history"></use>
                                        </svg>
                                        导出Word
                                    </div>
                                </PrivilegeProjectButton>
                            </>
                        }
                        <Divider />
                        <PrivilegeProjectButton domainId={document?.repositoryId} code={'wi_doc_comment'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('comment')}
                            >
                                <svg className="document-more-actions-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-comment"></use>
                                </svg>
                                评论
                                <div className='action-comment-num'>
                                    {commentNum}
                                </div>
                            </div>
                        </PrivilegeProjectButton>
                    </div>
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
            <EnhanceEntranceModal
                config={configEnhance[archivedFreeType]}
                visible={archivedFreeVisable}
                setVisible={setArchivedFreeVisable}
            />
        </Fragment>
    )
}

export default DocumentActionMenu
