/**
 * 用于静态图片转动态图标直接可以在这个组件修改地址即可
 */
import React from "react";
import setImageUrl from "../../utils/setImageUrl";

const Img = (props) => {
    const { src, alt, className, title, style, isRemote } = props;
    // const url = version === "cloud" ? `/images/${src}`: `/images/${src}`;
    const url = isRemote ? setImageUrl(src) : `/images/${src}`
    return (
        <>
            {
                url && <img
                    src={url}
                    alt={alt}
                    className={className}
                    title={title}
                    style={style}
                />
            }
        </>

    )
}

export default Img;
