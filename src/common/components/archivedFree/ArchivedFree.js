import React, {useEffect, useState} from "react";
import {CheckCircleTwoTone} from "@ant-design/icons";
import BaseModal from "../modal/Modal";
import {applySubscription} from 'tiklab-core-ui';
import "./ArchivedFree.scss";
import nodeArchived from "../../../assets/images/nodeArchived.png";
import nodeRecycle from "../../../assets/images/nodeRecycle.png";
import repositoryRecycle from "../../../assets/images/repositoryRecycle.png";
import documentVersion from "../../../assets/images/documentVersion.png";
import fileView from "../../../assets/images/fileView.png";
import exportWord from "../../../assets/images/exportWord.png";
import review from "../../../assets/images/review.png";

const ArchivedFree = (props) => {

    const {type = 'defalut',archivedFreeVisable,setArchivedFreeVisable} = props;

    const data = {
        defalut: [
            {id: "nodeArchived", icon: nodeArchived, title: "归档知识库"},
            {id: "nodeRecycle", icon: nodeRecycle, title: "文档目录回收站"},
            {id: "repositoryRecycle", icon: repositoryRecycle, title: "知识库回收站"},
        ],
        documentVersion: [
            {id: "version", icon: documentVersion, title: "文档版本"},
        ],
        documentFile: [
            {id: "fileView", icon: fileView, title: "附件预览"}
        ],
        documentReview: [
            {id: "review", icon: review, title: "文档评审"}
        ],
        documentExport: [
            {id: "exportWord", icon: exportWord, title: "导出Word"}
        ],
    }

    const title = {
        defalut: '知识库',
        documentVersion: '文档版本',
        documentFile: '附件',
        documentReview: '评审',
        documentExport: '导出'
    }

    const desc = {
        defalut: '回收站，归档',
        documentVersion: '文档版本',
        documentFile: '附件预览',
        documentReview: '评审',
        documentExport: 'Word'
    }

    const list = data[type];

    const [active, setActive] = useState(list ? list[0] : {});

    useEffect(() => {
        if(archivedFreeVisable){
            setActive(list ? list[0] : {})
        }
    }, [archivedFreeVisable]);

    return (
        <BaseModal
            width={800}
            visible={archivedFreeVisable}
            className="sward-enhance-modal"
            onCancel={()=>setArchivedFreeVisable(false)}
            closable={true}
            footer={null}
        >
            <div className="enhance-free">
                <div className="enhance-free-introduce">
                    <div className="enhance-title">{title[type]}</div>
                    <div className="enhance-title-desc">付费版本专属功能</div>
                    <div className="enhance-desc">
                        {desc[type]}
                    </div>
                    <div className="enhance-desc-box">
                        {
                            list.map(item => {
                                return (
                                    <div className={`enhance-desc-item ${item.id === active?.id ? 'enhance-desc-active-item' : ''}`}
                                         onClick={() => setActive(item)}
                                         onMouseEnter={() => setActive(item)}
                                         key={item.id}
                                    >
                                        <div><CheckCircleTwoTone /></div>
                                        <div>{item.title}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='enhance-desc-guid' onClick={()=>window.open('https://tiklab.net/contactus')}>
                        咨询购买
                    </div>
                    <div className='enhance-desc-buy' onClick={()=>applySubscription('sward')}>
                        立即购买
                    </div>
                </div>
                <div className="enhance-free-image">
                    <img src={active?.icon} alt="" width={"100%"} />
                </div>
            </div>
        </BaseModal>
    )
}

export default ArchivedFree;
