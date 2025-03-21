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

