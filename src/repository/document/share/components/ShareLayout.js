/*
 * @Descripttion: 页面主题框架
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React, {useState} from 'react';
import "./ShareLayout.scss";
import ShareAside from "./ShareAside";
import {Layout, Result} from "antd"
import {renderRoutes} from "react-router-config";
import CommentStore from "../../document/store/CommentStore";
import ShareStore from '../store/ShareStore';
import {Provider} from 'mobx-react';

const ShareLayout = (props) => {

    const { route } = props;

    const store = {
        commentStore: CommentStore,
        shareStore: ShareStore
    }

    //分享状态
    const [shareExist,setShareExist] = useState('exist');

    return (
        <Provider {...store}>
            <Layout className="share-page repositorydetail">
                <ShareAside
                    {...props}
                    setShareExist={setShareExist}
                />
                <Layout className="repositorydetail-content">
                    {
                        shareExist==='exist' &&
                        renderRoutes(route.routes)
                    }
                    {
                        shareExist==='noShare' &&
                        <div className='share-empty'>
                            <Result
                                status="warning"
                                title="该分享已被取消"
                            />
                        </div>
                    }
                    {
                        shareExist==='noDocument' &&
                        <div className='share-empty'>
                            <Result
                                status="warning"
                                title="分享的内容不存在"
                            />
                        </div>
                    }
                    {
                        shareExist==='noPermission' &&
                        <div className='share-empty'>
                            <Result
                                status="warning"
                                title="没有访问权限"
                            />
                        </div>
                    }
                </Layout>
            </Layout>
        </Provider>
    )
}


export default ShareLayout;
