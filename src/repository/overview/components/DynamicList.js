import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/breadcrumb/breadcrumb";
import { inject, observer } from "mobx-react";
import { getUser } from "thoughtware-core-ui";
import { Row, Col } from "antd";
import "./DynamicList.scss";
import SurveyStore from "../store/SurveyStore";
import DynamicListItem from "./DynamicItem";
const DynamicList = (props) => {
    const { findLogpage, opLogList } = SurveyStore;
    const userId = getUser().userId;
    const [firstText, setFirstText] = useState();
    const repositoryId = props.match.params.repositoryId;

    useEffect(() => {
        if (props.route.path === "/dynamic") {
            setFirstText("首页")
            findLogpage({ userId: userId,repositoryId: repositoryId })
        }

        if (props.route.path === "/repositorydetail/:repositoryId/dynamicList") {
            setFirstText("知识库概况")
            findLogpage({ userId: userId, repositoryId: repositoryId })
        }
        return;
    }, [])

    return (
        <Row className="dynamic-row">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }} className="dynamic-col">
                <div className="dynamic-list-page">
                    <div className="dynamic-list-top">
                        <Breadcumb
                            {...props}
                            firstText={firstText}
                            secondText="动态"
                        />
                        
                    </div>

                    <div className="dynamic-list">
                        {
                            opLogList && opLogList.map((item) => {
                                return <DynamicListItem content = {item.data} actionType = {item.actionType.id}/>
                            })
                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}
export default observer(DynamicList);