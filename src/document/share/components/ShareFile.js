
/*
 * @Descripttion: 分享的文件页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-08-09 09:18:21
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:32:37
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Row, Col } from 'antd';
import "tiklab-slate-ui/es/tiklab-slate.css";
import "./ShareFile.scss"
import { withRouter } from "react-router";
import Button from "../../../common/components/button/Button";
import {VerticalAlignBottomOutlined} from "@ant-design/icons";
import {disableFunction} from "tiklab-core-ui";

const ShareFile = (props) => {

    const { shareStore, ExtendShareFileView } = props;
    const { documentView } = shareStore;
    //文档
    const [documentData, setDocumentData] = useState(null);
    const disable = disableFunction();

    useEffect(() => {
        // 获取文档内容
        documentView({ documentId: props.match.params.id }).then((data) => {
            if (data.code === 0) {
                setDocumentData(data.data)
            }
        })
    }, [props.match.params.id])

    const details = documentData?.details && JSON.parse(documentData.details);
    const docInfo = documentData?.node;

    /**
     * 下载
     */
    const downFile = () => {
        event.preventDefault();
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = docInfo.name;
        a.href = `${upload_url}/file/${details.fileUrl}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const defaultContent = (
        <div className='document-file'>
            <svg className="icon-48" aria-hidden="true">
                <use xlinkHref="#icon-file"></use>
            </svg>
            <div className='document-file-name'>
                {docInfo?.name}
            </div>
            <Button
                type={'primary'}
                onClick={downFile}
            >
                <VerticalAlignBottomOutlined />
                &nbsp;&nbsp;下载
                {details?.fileSize ? `(${details.fileSize})` : ''}
            </Button>
        </div>
    )

    return (
        <div className="file-share-examine">
            <div className="examine-title">
                <span className="examine-name">{docInfo?.name}</span>
            </div>
            <div className="examine-content">
                <Row style={{ flex: 1, overflow: "auto" }}>
                    <Col
                        className="repositorydetail-content-col"
                        xs={{ span: 22, offset: 1 }}
                        lg={{ span: 18, offset: 3 }}
                        xl={{ span: 16, offset: 4 }}
                    >
                        {
                            (!disable && ExtendShareFileView) ?
                                <ExtendShareFileView
                                    defaultContent={defaultContent}
                                    documentTitle={docInfo?.name}
                                    documentData={documentData}
                                />
                                :
                                defaultContent
                        }
                    </Col>
                </Row>
            </div>
        </div>

    )
}

export default inject("shareStore")(observer(withRouter(ShareFile)));
