/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 14:57:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:05:41
 * @Description: 添加知识库页面
 */
import React, {useRef} from "react";
import 'moment/locale/zh-cn';
import { observer } from "mobx-react";
import "./repositoryAdd.scss";
import RepositoryAddInfo from "./RepositoryAddInfo";
import Modal from "../../../common/components/modal/Modal";

const RepositoryAdd = (props) => {

    const {addVisible,setAddVisible,repository,setRepository,changFresh} = props;


    const repositoryInfoRef = useRef(null);

    /**
     * 确定
     */
    const onOk = () => {
        if (repositoryInfoRef.current) {
            repositoryInfoRef.current.onFinish();
        }
    }

    /**
     * 关闭弹出框
     */
    const onCancel = ()=>{
        setAddVisible(false);
        setRepository(null);
    }

    return (
        <Modal
            title={repository ? '编辑知识库' : '添加知识库'}
            visible={addVisible}
            width={600}
            onCancel={onCancel}
            onOk={onOk}
            destroyOnClose
        >
            <RepositoryAddInfo
                {...props}
                ref={repositoryInfoRef}
                repository={repository}
                changFresh={changFresh}
                onCancel={onCancel}
            />
        </Modal>

    );
};

export default observer(RepositoryAdd);
