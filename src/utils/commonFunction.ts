import { ElMessage } from "element-plus"


export function reqAndMessage(result: any, messagePrefix: string = '') {
    if (result.code === 200) {
        ElMessage.success(messagePrefix + '成功')
    } else {
        ElMessage.error(messagePrefix + '失败')
    }
}