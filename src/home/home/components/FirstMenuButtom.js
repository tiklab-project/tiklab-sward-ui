/*
 * @Descripttion: 系统一级导航底部组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-31 15:46:31
 */
import React, { Component, useState } from "react";
import { AppLink, AvatarLink, HelpLink } from 'tiklab-licence-ui';
import { AppLink as AppLinkCloud, AvatarLink as AvatarLinkCloud, HelpLink as HelpLinkCloud } from 'tiklab-licence-cloud-ui';
import MessageList from "./MessageList";
import UserIcon from "../../../common/UserIcon/UserIcon"
import "./FirstMenuButtom.scss"
import { getUser } from "tiklab-core-ui";
import SetingMenu from "./SetingMenu";
const FirstMenuButtom = (props) => {
    const { isShowText, SetIsShowText, theme, changeTheme } = props;
    const nickname = getUser().nickname;
    return <>
        {
            version === "cloud" ?
            <>
            {
                isShowText ?
                    <div className="first-menu-bottom-text ">
                        <SetingMenu isShowText={isShowText} theme={theme} />
                        <MessageList isShowText={isShowText} theme={theme} />
                        <HelpLinkCloud
                            bgroup={"kanass"}
                            iconComponent={
                                <div className="first-menu-text-item">
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref={`#icon-help-${theme}`} ></use>
                                    </svg>
                                    <div>帮助</div>
                                </div>

                            }
                        />
                        <AppLinkCloud
                            translateX={isShowText ? 200 : 75}
                            iconComponent={
                                <div className="first-menu-text-item">
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref={`#icon-application-${theme}`} ></use>
                                    </svg>
                                    <div>切换应用</div>
                                </div>

                            }
                        />
                        <AvatarLinkCloud

                            changeTheme={changeTheme}
                            iconComponent={
                                <div className="first-menu-text-item">
                                    <UserIcon name={nickname} />
                                    <div>{nickname}</div>
                                </div>
                            }
                            {...props}
                        />

                    </div>

                    :
                    <div className="first-menu-bottom-icon">
                        <SetingMenu isShowText={isShowText} theme={theme} />
                        <MessageList isShowText={isShowText} theme={theme} />
                        <HelpLinkCloud
                            bgroup={"kanass"}
                            iconComponent={
                                <div className="first-menu-link-item" data-title-right="帮助">
                                    <svg className="icon-18 " aria-hidden="true">
                                        <use xlinkHref={`#icon-help-${theme}`} ></use>
                                    </svg>
                                </div>

                            }
                        />
                        <AppLinkCloud
                            translateX={isShowText ? 200 : 75}
                            iconComponent={
                                <div className="first-menu-link-item" data-title-right="应用导航">
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref={`#icon-application-${theme}`} ></use>
                                    </svg>
                                </div>

                            }
                        />
                        <AvatarLinkCloud
                            changeTheme={changeTheme}
                            iconComponent={
                                <div className="first-menu-link-item" data-title-right={nickname}>
                                    <UserIcon name={nickname} />
                                </div>
                            }
                            {...props}
                        />
                    </div>
            }
        </>
                :
                <>
                    {
                        isShowText ?
                            <div className="first-menu-bottom-text ">
                                <SetingMenu isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLink
                                    bgroup={"kanass"}
                                    iconComponent={
                                        <div className="first-menu-text-item">
                                            <svg className="icon-18" aria-hidden="true">
                                                <use xlinkHref={`#icon-help-${theme}`} ></use>
                                            </svg>
                                            <div>帮助</div>
                                        </div>

                                    }
                                />
                                <AppLink
                                    translateX={isShowText ? 200 : 75}
                                    iconComponent={
                                        <div className="first-menu-text-item">
                                            <svg className="icon-18" aria-hidden="true">
                                                <use xlinkHref={`#icon-application-${theme}`} ></use>
                                            </svg>
                                            <div>切换应用</div>
                                        </div>

                                    }
                                />
                                <AvatarLink

                                    changeTheme={changeTheme}
                                    iconComponent={
                                        <div className="first-menu-text-item">
                                            <UserIcon name={nickname} />
                                            <div>{nickname}</div>
                                        </div>
                                    }
                                    {...props}
                                />

                            </div>

                            :
                            <div className="first-menu-bottom-icon">
                                <SetingMenu isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLink
                                    bgroup={"kanass"}
                                    iconComponent={
                                        <div className="first-menu-link-item" data-title-right="帮助">
                                            <svg className="icon-18 " aria-hidden="true">
                                                <use xlinkHref={`#icon-help-${theme}`} ></use>
                                            </svg>
                                        </div>

                                    }
                                />
                                <AppLink
                                    translateX={isShowText ? 200 : 75}
                                    iconComponent={
                                        <div className="first-menu-link-item" data-title-right="应用导航">
                                            <svg className="icon-18" aria-hidden="true">
                                                <use xlinkHref={`#icon-application-${theme}`} ></use>
                                            </svg>
                                        </div>

                                    }
                                />
                                <AvatarLink
                                    changeTheme={changeTheme}
                                    iconComponent={
                                        <div className="first-menu-link-item" data-title-right={nickname}>
                                            <UserIcon name={nickname} />
                                        </div>
                                    }
                                    {...props}
                                />
                            </div>
                    }
                </>


        }

    </>


}

export default FirstMenuButtom;