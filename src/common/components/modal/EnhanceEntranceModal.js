import React, { useEffect, useRef } from "react";
import "./EnhanceEntranceModal.scss";
import { applySubscription, disableFunction } from "tiklab-core-ui";

/**
 * 模态框内容组件（内部复用）
 */
const ModalContent = ({ config, contentRef }) => (
    <div className='enhance-entrance-modal'>
        <div className='enhance-entrance-modal-content'>
            <div className="enhance-popup-container" ref={contentRef}>
                <div className="enhance-title">{config?.title}</div>
                <div className="enhance-fea">企业版专属功能</div>
                <div className="enhance-desc">{config?.desc}</div>
                <div className="enhance-button">
                    <button
                        className="enhance-button-contact"
                        onClick={() => window.open('https://tiklab.net/contactus')}
                    >
                        联系客服
                    </button>
                    <button
                        className="enhance-button-update"
                        onClick={() => applySubscription('sward')}
                    >
                        升级版本
                    </button>
                </div>
            </div>
        </div>
    </div>
);

/**
 * 主组件
 */
const EnhanceEntranceModal = (props) => {

    const { config, visible, setVisible, mode = "dialog" } = props;
    const modalRef = useRef(null);

    // 处理模式为page时的显示逻辑
    if (mode === "page") {
        return disableFunction() ? (
            <div className="sward-enhance-entrance-modal">
                <ModalContent config={config} />
            </div>
        ) : null;
    }

    // dialog模式的事件处理
    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setVisible(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setVisible(false);
        };

        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [visible]);

    return (
        <div className={`sward-enhance-entrance-modal ${visible ? "" : "sward-enhance-entrance-modal-hidden"}`}>
            <ModalContent config={config} contentRef={modalRef} />
        </div>
    );
};

export default EnhanceEntranceModal;
