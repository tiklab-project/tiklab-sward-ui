/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-10 15:56:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-10 16:51:01
 */
import { observable, action} from "mobx";
import { Service } from "../../../../common/utils/requset";
class CommentStore {
    @observable repositoryCommonList = [];
    @observable commonPageParams = {
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };
    @action
    createComment = async(value)=> {
        console.log(value)
        const data = await Service("/comment/createComment",value);
        return data;
    }

    @action
    findCommentPage = async(value)=> {
        const data = await Service("/comment/findCommentTreePage",value);
        return data;

    }

    @action
    deleteComment = async(value)=> {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/comment/deleteComment",params);
        return data;
    }

    @action
    deleteCommentCondition = async(value)=> {
        const data = await Service("/comment/deleteCommentCondition",value);
        return data;
    }

    @action
    createLike = async(value)=> {
        const data = await  Service("/like/createLike",value);
        return data;
    }

    @action
    deleteLike = async(value)=> {
        const data = await Service("/like/deleteLikeCondition",value);
        return data;
    }

    @action
    createShare = async(value)=> {
        const data = await Service("/share/addShare",value);
        return data;
    }

    @action
    updateShare = async(value)=> {
        const data = await Service("/share/cutHaveOrNotAuthCode",value);
        return data;
    }
}

export default new CommentStore();
