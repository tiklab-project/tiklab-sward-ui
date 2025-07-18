const appendNodeInTree = (id, tree, obj, setType) => {
    if (id) {
        tree.forEach(ele => {
            if (ele.id === id) {
                switch (setType) {
                    case "inset":
                        ele.children ? ele.children.unshift(...obj) : ele.children = obj;
                        break;
                    case "overview":
                        ele.children = obj
                        break;
                    default:
                        ele.children ? ele.children.unshift(...obj) : ele.children = obj;
                        break
                }
            } else {
                if (ele.children) {
                    appendNodeInTree(id, ele.children, obj, setType)
                }
            }
        })
    } else {
        tree.unshift(...obj)
    }

    return tree
}

// const removeNodeInTree = (tree, parentNode, id) => { // 通过id从数组（树结构）中移除元素
//     if (!tree || !tree.length) {
//         return
//     }

//     for (let i = 0; i < tree.length; i++) {
//         if (tree[i].id === id) {
//             tree.splice(i, 1);
//             if(tree.length === i + 1){
//                 return parentNode;
//             }
//         }


//         removeNodeInTree(tree[i].children, id)
//     }
// }

const removeNodeInTree = (tree, parentNode, id) => {
    // 遍历数组中的每个节点
    let jumpNode = null;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            tree.splice(i, 1);
            if(tree.length === 0){
                jumpNode = parentNode;
            } else if(tree.length === i){
                jumpNode = tree[i - 1]
            } else {
                jumpNode = tree[i];
            }
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
            const jumpNode1 = removeNodeInTree(node.children, node, id);
            if (jumpNode1) {
                jumpNode =  jumpNode1; // 如果子节点中找到了要删除的节点，则返回该节点
            }
        }
    }
    return jumpNode;
}


const removeNodeAndSort = (tree, id) => {
    if (!tree || !tree.length) {
        return null;
    }
    let node = null;
    if (id === "nullString") {
        tree.splice(sort, 1)
        // 为了删除之后方便重新进入新文档
        // 如果当前顺序大于1
        if (tree.length > 0) {
            if (sort <= tree.length - 1) {
                node = tree[sort]
            } else {
                node = tree[sort - 1]
            }
        } else {
            node = null
        }
        tree.map((item) => {
            if (item.sort > sort) {
                item.sort = item.sort - 1
            }
            return item;
        })
    } else {
        tree.forEach(ele => {

            if (ele.id === id) {

                ele.children.splice(sort, 1)
                if (ele.children.length > 0) {
                    if (sort <= ele.children.length - 1) {
                        node = ele.children[sort]
                    } else {
                        node = ele.children[sort - 1]
                    }
                } else {
                    node = ele;
                }
                ele.children.map((item) => {
                    if (item.sort > sort) {
                        item.sort = item.sort - 1
                    }
                })
            } else {
                if (ele.children) {
                    const foundNode = removeNodeAndSort(ele.children, id, sort);
                    if (foundNode) {
                        node = foundNode; // 设置找到的节点为当前节点
                    }
                }
            }
        })
    }
    return node;
}



const updataTreeSort = (tree, params) => { // 通过id从数组（树结构）中移除元素
    const { id } = params;
    const deleteNode = removeNodeForUpdate(tree, id)
    tree = insertNodeAndSort(tree, params, deleteNode)
    console.log(deleteNode)
    return tree;
}


const removeNodeForUpdate = (tree, id) => {
    // 遍历数组中的每个节点
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            tree.splice(i, 1);
            return node; // 结束函数，因为已经删除了节点
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
            const deletedNode = removeNodeForUpdate(node.children, id);
            if (deletedNode) {
                return deletedNode; // 如果子节点中找到了要删除的节点，则返回该节点
            }
        }
    }
}

const insertNodeAndSort = (tree, params, node) => { // 通过id从数组（树结构）中移除元素
    const { moveToId, moveType } = params;
    switch (moveType) {
        case "1":
            insertNode(tree, moveToId, node);
            break;
        case "2":
            insertNodeInCategary(tree, moveToId, node)
            break;
        case "3":
            insertNodeInRepository(tree, node)
            break;
        default:
            break
    }
    return tree;
}

const insertNode = (tree, moveToId, node) => {
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === moveToId) {
            tree = tree.splice(i + 1, 0, node)
            return true; // 插入成功后返回true
        } else {
            if (tree[i].children != null) {
                if (insertNode(tree[i].children, moveToId, node)) {
                    return true; // 如果在子节点中成功插入了新节点，则返回true
                }
            }
        }
    }
    return false; // 如果未找到匹配的节点，则返回false
}
// 拖动的第二种情况， 拖动到某个目录的最上面
const insertNodeInCategary = (tree, moveToId, node) => {
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === moveToId) {
            if (tree[i].children != null) {
                tree[i].children.unshift(node)
            } else {
                tree[i].children = []
                tree[i].children.unshift(node)
            }
            return true; // 插入成功后返回true
        } else {
            if (tree[i].children != null) {
                if (insertNodeInCategary(tree[i].children, moveToId, node)) {
                    return true; // 如果在子节点中成功插入了新节点，则返回true
                }
            }
        }
    }
}

const insertNodeInRepository = (tree, node) => {
    tree.unshift(node)
}

const findNodeById = (tree, params) => {
    console.log("findNodeById", params)
    const { id } = params;
    let node = null;
    let state = false;
    const readTree = (_tree, id) => {
        if (state) return;
        console.log(_tree)
        if (!_tree) return
        for (let i = 0; i < _tree.length; i++) {

            if (_tree[i].id === id) {
                state = true;
                node = _tree[i];
            } else {
                _tree[i].children !== null && readTree(_tree[i].children, id);
            }
        }
    };
    readTree(tree, id);

    return node;
};


const updateNode = (node, distence) => {
    if (!node || !node.length) {
        return
    }
    node.forEach(item => {
        item.dimension = item.dimension + distence;
        if (item.children != null) {
            updateNode(item.children)
        }

        return item;
    })
}

const replaceTree = (tree, node) => {
    tree.forEach((item, index) => {
        if (item.id === node.id) {
            tree[index] = node;
        } else {
            if (item.children) {
                replaceTree(item.children, node)
            }
        }
        return item;
    })
}

const updateNodeName = (tree, id, name) => {
    tree.forEach((item, index) => {
        if (item.id === id) {
            tree[index].name = name;
        } else {
            if (item.children) {
                updateNodeName(item.children, id, name)
            }
        }
        return item;
    })
}
export { appendNodeInTree, removeNodeInTree, removeNodeAndSort, updataTreeSort, findNodeById, replaceTree, updateNodeName };
