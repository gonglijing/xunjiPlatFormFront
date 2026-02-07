import { ElMessage, ElMessageBox, ElNotification, MessageBoxOptions } from 'element-plus'

/**
 * 通用消息提示 Composable
 */
export function useMessage() {
  // 成功消息
  const success = (message: string) => {
    ElMessage.success(message)
  }

  // 错误消息
  const error = (message: string) => {
    ElMessage.error(message)
  }

  // 警告消息
  const warning = (message: string) => {
    ElMessage.warning(message)
  }

  // 普通消息
  const info = (message: string) => {
    ElMessage.info(message)
  }

  // 确认框
  const confirm = async (
    message: string,
    title: string = '提示',
    options?: Partial<MessageBoxOptions>
  ): Promise<'confirm' | 'cancel' | 'close'> => {
    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        ...options,
      })
      return 'confirm'
    } catch {
      return 'cancel'
    }
  }

  // 确认框（自定义按钮）
  const confirmEx = async (
    message: string,
    title: string = '提示',
    options: Partial<MessageBoxOptions> & { confirmButtonText?: string; cancelButtonText?: string } = {}
  ): Promise<'confirm' | 'cancel' | 'close'> => {
    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: options.confirmButtonText || '确定',
        cancelButtonText: options.cancelButtonText || '取消',
        type: 'warning',
        ...options,
      })
      return 'confirm'
    } catch {
      return 'cancel'
    }
  }

  // 提示框
  const prompt = async (
    message: string,
    title: string = '提示',
    options: { inputPattern?: RegExp; inputErrorMessage?: string } = {}
  ): Promise<{ value: string; action: 'confirm' | 'cancel' }> => {
    try {
      const res = await ElMessageBox.prompt(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        ...options,
      })
      return { value: res.value, action: 'confirm' }
    } catch {
      return { value: '', action: 'cancel' }
    }
  }

  // 成功通知
  const notifySuccess = (message: string, title: string = '成功') => {
    ElNotification.success({
      title,
      message,
    })
  }

  // 错误通知
  const notifyError = (message: string, title: string = '错误') => {
    ElNotification.error({
      title,
      message,
    })
  }

  // 警告通知
  const notifyWarning = (message: string, title: string = '警告') => {
    ElNotification.warning({
      title,
      message,
    })
  }

  // 信息通知
  const notifyInfo = (message: string, title: string = '信息') => {
    ElNotification.info({
      title,
      message,
    })
  }

  return {
    // 消息提示
    success,
    error,
    warning,
    info,
    // 确认框
    confirm,
    confirmEx,
    prompt,
    // 通知
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  }
}
