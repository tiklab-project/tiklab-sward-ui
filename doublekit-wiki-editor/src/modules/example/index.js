/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-23 13:34:34
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-23 14:20:48
 */
import React, {Fragment, useState} from "react";
import Editor from "../edit-slate/editor";
import PreviewEditor from "../edit-slate/previewEditor";
// showMenu = {true}
const ExampleEditor = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [value, setValue] = useState([
		{
			type: "paragraph",
			children: [{ text: "kkkk" }],
		},
	])
    return (
        <Fragment>
            <div onClick={() => {setShowMenu(!showMenu)}}>确定</div>
            <div >
                
            { showMenu ? <Editor 
                    value = {value} 
                    onChange = {setValue} 
                />
                :
                <PreviewEditor value = {value} 
                    onChange = {setValue} />}
            </div>
        </Fragment>
        
    )
}
export default ExampleEditor;