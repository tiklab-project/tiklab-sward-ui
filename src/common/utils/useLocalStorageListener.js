import { useEffect } from "react"

// function safeParse(jsonString) {
//     if (jsonString === null) {
//         return null
//     }
//     try {
//         return JSON.parse(jsonString)
//     } catch (error) {
//         console.error("Error parsing JSON:", error)
//         return null
//     }
// }

function useLocalStorageListener(localStorageKey, callback) {
    useEffect(() => {
        const originalSetItem = localStorage.setItem
        localStorage.setItem = function (key, newValue) {
            const setItemEvent = new CustomEvent("setItemEvent", {
                detail: { key, newValue },
            })
            window.dispatchEvent(setItemEvent)
            originalSetItem.apply(this, [key, newValue])
        }

        const handleSetItemEvent = (event) => {
            const customEvent = event
            if (event.detail.key === localStorageKey) {
                // 这里的key就是本地存储对应的key
                const updatedValue = customEvent.detail.newValue
                callback(updatedValue) // 将本地存储最新的值传给回调函数
            }
        }

        window.addEventListener("setItemEvent", handleSetItemEvent)

        return () => {
            window.removeEventListener("setItemEvent", handleSetItemEvent)
            localStorage.setItem = originalSetItem
        }
    }, [localStorageKey, callback])
}

export default useLocalStorageListener
