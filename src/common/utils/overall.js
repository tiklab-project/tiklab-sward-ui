import {useCallback, useEffect, useRef} from "react";

/**
 * 文件类型图标
 */
export const getFileIcon = (fileName) => {
    if (!fileName) return 'file';

    const ext = fileName.split(".").pop().toLowerCase();

    switch (ext) {
        case "doc":
        case "docx":
            return 'word';
        case "xls":
        case "xlsx":
            return 'excel';
        case "ppt":
        case "pptx":
        case "pdf":
            return 'ppt';
        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'audio'
        case 'mp4':
        case 'avi':
        case 'mkv':
            return 'video'
        default:
            return 'file';
    }
};

/**
 * 去掉文件类型后缀
 */
export const removeFileExtension = (fileName) => {
    return fileName.lastIndexOf(".") === -1
        ? fileName
        : fileName.slice(0, fileName.lastIndexOf("."));
};

/**
 * 获取文件类型后缀
 */
export const getFileExtension = (fileName) => {
    return fileName.includes(".")
        ? fileName.slice(fileName.lastIndexOf(".") + 1)
        : "";
};

/**
 * 获取文件类型后缀包括点
 */
export const getFileExtensionWithDot = (fileName) => {
    return fileName.includes(".")
        ? fileName.slice(fileName.lastIndexOf("."))
        : "";
};

/**
 * 格式化文件大小
 * @param {number} size - 文件大小（字节）
 * @returns {string} - 格式化后的文件大小（KB 或 MB）
 */
export const formatFileSize = (size) => {
    const KB_SIZE = 1024; // 1KB = 1024字节
    const MB_SIZE = KB_SIZE * 1024; // 1MB = 1024KB
    if (size < MB_SIZE) {
        return `${(size / KB_SIZE).toFixed(2)} KB`; // 转换为 KB
    } else {
        return `${(size / MB_SIZE).toFixed(2)} MB`; // 转换为 MB
    }
};

/**
 * 文档跳转维护
 */
export const documentPush = (history,repositoryId,document) =>{
    const {type,documentType,id} = document;
    if(type==='category'){
        history.push(`/repository/${repositoryId}/doc/folder/${id}`)
    } else {
        switch (documentType) {
            case 'document':
                history.push(`/repository/${repositoryId}/doc/rich/${id}`)
                break
            case 'markdown':
                history.push(`/repository/${repositoryId}/doc/markdown/${id}`)
                break
            case 'file':
                history.push(`/repository/${repositoryId}/doc/file/${id}`)
                break
        }
    }
}

/**
 * 分页
 */
export const deleteSuccessReturnCurrenPage = (totalRecord, pageSize, current) => {
    const maxCurrentCount = current * pageSize;
    const minCurrentCount = (current - 1) * pageSize + 1;
    if (totalRecord >= maxCurrentCount) {
        return current
    }
    if (totalRecord <= minCurrentCount) {
        return current === 1 ? 1 : current - 1
    }
    return current
}

/**
 * 延迟
 * @param ms
 * @returns {Promise<unknown>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 防抖
 * @param fn
 * @param delay
 * @param dep
 * @returns {(function(...[*]): void)|*}
 */
export function useDebounce(fn, delay, dep = []) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);
    useEffect(() => {
        return () => {
            if (current.timer) {
                clearTimeout(current.timer);
            }
        };
    }, []);
    return useCallback(function f(...args) {
        if (current.timer) {
            clearTimeout(current.timer);
        }
        current.timer = setTimeout(() => {
            current.fn.call(this, ...args);
        }, delay);
    }, dep)
}
