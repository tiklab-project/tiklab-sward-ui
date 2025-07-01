/**
 * @Description: 弹出框
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/10
 */
import React from "react";
import {Modal} from "antd";
import Button from "../button/Button";
import "./Modal.scss";

const BaseModal = ({children,...res}) => {

    const modalFooter = (
        <>
            <Button onClick={res.onCancel} className="cancel-text-button">
                {res.cancelText ||  "取消"}
            </Button>
            <Button onClick={res.onOk} type={"primary"}>
                {res.okText || "确定"}
            </Button>
        </>
    )

    return(
        <Modal
            wrapClassName="sward-modal"
            footer={modalFooter}
            {...res}
        >
            {children}
        </Modal>
    )
};

export default BaseModal;
