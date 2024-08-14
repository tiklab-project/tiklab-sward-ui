import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/breadcrumb/breadcrumb";
import { inject, observer } from "mobx-react";
import { getUser } from "thoughtware-core-ui";
import { Row, Col, Empty } from "antd";
import "./DynamicList.scss";
import SurveyStore from "../store/SurveyStore";
import DynamicListItem from "./DynamicItem";
import DyncmicTimeAxis from "./DyncmicTimeAxis";
import PaginationCommon from "../../../common/page/Page";
import { nodata } from "../../../assets/image";
const DynamicList = (props) => {
    const { findLogpage, logList, opLogCondition } = SurveyStore;
    const userId = getUser().userId;
    const [firstText, setFirstText] = useState();
    const repositoryId = props.match.params.repositoryId;

    useEffect(() => {
        if (props.route.path === "/dynamic") {
            setFirstText("首页")
            findLogpage({data: { repositoryId: repositoryId }, pageParam: {...opLogCondition.pageParam, pageSize: 20 }})
        }

        if (props.route.path === "/repository/:repositoryId/dynamicList") {
            setFirstText("知识库概况")
            findLogpage({data: { repositoryId: repositoryId }, pageParam: {...opLogCondition.pageParam, pageSize: 20 }})
        }
        return;
    }, [])
    const onPageChange = (page, pageSize) => {
        const params = {
            pageParam: {
                ...opLogCondition.pageParam,
                currentPage: page
            }

        }
        findLogpage(params)
    };
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
                            logList && logList.length > 0 ? <DyncmicTimeAxis logList={logList} /> : <Empty image={nodata} description="暂时没有动态~" />
                        }
                    </div>

                    <PaginationCommon
                        currentPage={opLogCondition.pageParam.currentPage}
                        changePage={(currentPage) => onPageChange(currentPage)}
                        totalPage={opLogCondition.pageParam.totalPage}
                        total={opLogCondition.pageParam.total}
                        refresh={() => onPageChange(1)}
                        showRefresh={true}
                    />
                </div>
            </Col>
        </Row>
    )
}
export default observer(DynamicList);