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
import {
    ClockCircleOutlined,
    FilePdfOutlined,
    FileTextOutlined,
    FileWordOutlined, FlagOutlined,
    MessageOutlined
} from "@ant-design/icons";

const DocumentActionMenu = (props) => {

    const {
        document:documentInfo,commentNum,setShowComment,setValue,documentVersion,setDocumentVersion,
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
    const
        selectMoreType = async (key) => {
        setDropdownVisible(false);
        switch (key) {
            case 'comment':
                setShowComment(true);
                break;
            case 'export-word':
                exportsWord();
                break
            case 'version-add':
                if(disable){
                    setArchivedFreeVisable(true);
                    setArchivedFreeType('documentVersion')
                } else {
                    setVersionAddVisible(true);
                }
                break;
            case 'version-view':
                if(disable){
                    setArchivedFreeVisable(true);
                    setArchivedFreeType('documentVersion')
                } else {
                    setVersionViewVisible(true);
                }
                break;
            case 'review':
                if(disable){
                    setArchivedFreeVisable(true);
                    setArchivedFreeType('documentReview')
                } else {
                    const nodeStatus = documentInfo?.node?.nodeStatus;
                    if(nodeStatus===3 && typeof updateNode === 'function'){
                        // 下线
                        updateNode()
                    } else {
                        // 评审
                        setReviewAddVisible(true);
                    }
                }
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
                        <PrivilegeProjectButton domainId={documentInfo?.repositoryId} code={disable ? null:'wi_doc_find_version'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('version-view')}
                            >
                                <ClockCircleOutlined className='document-more-actions-icon'/>
                                查看版本
                            </div>
                        </PrivilegeProjectButton>
                    </div>
                    :
                    <div className='sward-dropdown-more'>
                        {
                            documentInfo?.node?.nodeStatus === 2 ? null :
                                <>
                                    <PrivilegeProjectButton
                                        domainId={documentInfo?.repositoryId}
                                        code={
                                            disable ? null :
                                            documentInfo?.node?.nodeStatus === 3 ? 'wi_doc_offline' : 'wi_doc_commit_review'
                                        }
                                    >
                                        <div
                                            className='document-more-actions dropdown-more-item'
                                            onClick={() => selectMoreType('review')}
                                        >
                                            <svg className="document-more-actions-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-commit"></use>
                                            </svg>
                                            {documentInfo?.node?.nodeStatus === 3 ? '下线' : '提交评审'}
                                        </div>
                                    </PrivilegeProjectButton>
                                    <Divider />
                                </>
                        }
                        <PrivilegeProjectButton domainId={documentInfo?.repositoryId} code={disable ? null:'wi_doc_add_version'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('version-add')}
                            >
                                <FlagOutlined className='document-more-actions-icon'/>
                                添加版本
                            </div>
                        </PrivilegeProjectButton>
                        <PrivilegeProjectButton domainId={documentInfo?.repositoryId} code={disable ? null:'wi_doc_find_version'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('version-view')}
                            >
                                <ClockCircleOutlined className='document-more-actions-icon'/>
                                查看版本
                            </div>
                        </PrivilegeProjectButton>
                        {
                            documentInfo?.node?.documentType === 'document' &&
                            <>
                                <Divider />
                                <PrivilegeProjectButton domainId={documentInfo?.repositoryId} code={'wi_doc_import_word'}>
                                    <div
                                        className='document-more-actions dropdown-more-item'
                                        onClick={() => selectMoreType('export-word')}
                                    >
                                        <FileWordOutlined className='document-more-actions-icon'/>
                                        导出Word
                                    </div>
                                </PrivilegeProjectButton>
                                {/*<div*/}
                                {/*    className='document-more-actions dropdown-more-item'*/}
                                {/*    onClick={() => selectMoreType('export-pdf')}*/}
                                {/*>*/}
                                {/*    <FilePdfOutlined className='document-more-actions-icon'/>*/}
                                {/*    导出Pdf*/}
                                {/*</div>*/}
                                {/*<div*/}
                                {/*    className='document-more-actions dropdown-more-item'*/}
                                {/*    onClick={() => selectMoreType('export-html')}*/}
                                {/*>*/}
                                {/*    <FileTextOutlined className='document-more-actions-icon'/>*/}
                                {/*    导出Html*/}
                                {/*</div>*/}
                            </>
                        }
                        <Divider />
                        <PrivilegeProjectButton domainId={documentInfo?.repositoryId} code={'wi_doc_comment'}>
                            <div
                                className='document-more-actions dropdown-more-item'
                                onClick={() => selectMoreType('comment')}
                            >
                                <MessageOutlined className='document-more-actions-icon'/>
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
                        document={documentInfo}
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
                    document={documentInfo}
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
                    document={documentInfo}
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
