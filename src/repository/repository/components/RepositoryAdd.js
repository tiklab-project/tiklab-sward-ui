/*
 * @Author: 袁婕轩
 * @Date: 2023-01-05 14:57:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 17:05:41
 * @Description: 添加知识库页面
 */
import React from "react";
import { Row, Col } from 'antd';
import 'moment/locale/zh-cn';
import { observer, Provider } from "mobx-react";
import "./repositoryAdd.scss";

import RepositoryAddInfo from "./RepositoryAddInfo";
import Breadcumb from "../../../common/components/breadcrumb/Breadcrumb";
import RepositoryStore from "../store/RepositoryStore";
const RepositoryAdd = (props) => {
    const { selectTabs } = props;
    // const history = useHistory();
    const { addRepositorylist, findRepositoryList } = RepositoryStore;
    const store = {
        repositoryStore: RepositoryStore
    }
    const Head = () => {
        return (
            <Breadcumb
                firstText="添加知识库"
            >
                <div onClick={() => props.history.goBack()} className="repositoryadd-close">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-close"></use>
                    </svg>
                </div>
            </Breadcumb>
        )
    }


    return (
        <Provider {...store}>
            <div >
                <Row>
                    <Col
                        className="repository-type-col"
                        xs={{ span: '24'}}
                        lg={{ span: "18", offset: "3" }}
                        xl={{ span: "14", offset: "5" }}
                        xxl={{ span: "10", offset: "7" }}
                        style={{ height: "100%" }}
                    >
                        <Head />
                        <div>
                            <RepositoryAddInfo addRepositorylist={addRepositorylist} findRepositoryList={findRepositoryList} selectTabs={selectTabs} />
                        </div>
                    </Col>
                </Row>

            </div>
        </Provider>

    );
};

export default observer(RepositoryAdd);
