import { reactive, ref, Ref, watch } from 'vue'
import { useMessage } from '/@/composables'

/**
 * 通用状态参数
 */
export function useStatusParams(defaultStatus: number = 1) {
  const statusParams = reactive({
    status: defaultStatus,
  })

  return { statusParams }
}

/**
 * 搜索 Hook
 * @param api API 函数
 * @param resKey 返回数据的 key
 * @param expandParams 额外参数
 */
export function useSearch<T>(api: any, resKey: string, expandParams?: any) {
  interface SearchParams {
    status: -1 | 0 | 1
    pageNum: number
    pageSize: number
    total: number
    [key: string]: any
  }

  const params = reactive<SearchParams>({
    status: -1,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    ...expandParams,
  })

  const loading = ref(false)
  const tableData = ref<T[] | any[]>([])

  const getList = async (pageNum?: number) => {
    typeof pageNum === 'number' && (params.pageNum = pageNum)
    tableData.value = []
    loading.value = true
    params.total = 0
    let res = await api(params).finally(() => (loading.value = false))
    // console.log(res)
    tableData.value = resKey ? res[resKey] || res : res || []
    params.total = res.total
  }

  return { params, tableData, getList, loading }
}

/**
 * 分页 Hook
 */
export function usePagination(options: {
  pageSize?: number
  immediate?: boolean
  onChange?: (page: number, size: number) => void
} = {}) {
  const { pageSize = 10, immediate = false, onChange } = options

  const pagination = reactive({
    pageNum: 1,
    pageSize,
    total: 0,
  })

  const onPageChange = (page: number) => {
    pagination.pageNum = page
    onChange?.(page, pagination.pageSize)
  }

  const onSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.pageNum = 1
    onChange?.(1, size)
  }

  const resetPagination = () => {
    pagination.pageNum = 1
    pagination.total = 0
  }

  return {
    pagination,
    onPageChange,
    onSizeChange,
    resetPagination,
  }
}

/**
 * 弹窗 Hook
 */
export function useDialog(options: {
  onOpen?: () => void
  onClose?: () => void
} = {}) {
  const { onOpen, onClose } = options

  const dialogVisible = ref(false)

  const openDialog = () => {
    dialogVisible.value = true
    onOpen?.()
  }

  const closeDialog = () => {
    dialogVisible.value = false
    onClose?.()
  }

  const toggleDialog = () => {
    dialogVisible.value = !dialogVisible.value
  }

  return {
    dialogVisible,
    openDialog,
    closeDialog,
    toggleDialog,
  }
}

/**
 * 加载状态 Hook
 */
export function useLoading(immediate: boolean = false) {
  const loading = ref(immediate)

  const startLoading = () => {
    loading.value = true
  }

  const stopLoading = () => {
    loading.value = false
  }

  const toggleLoading = () => {
    loading.value = !loading.value
  }

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
  }
}

/**
 * 表单 Hook
 */
export function useForm<T extends Record<string, any>>(initialForm: Partial<T>) {
  const form = reactive<T>({ ...initialForm } as T)
  const formRef = ref()

  const resetForm = () => {
    Object.assign(form, initialForm)
    formRef.value?.resetFields?.()
  }

  const fillForm = (data: Partial<T>) => {
    Object.assign(form, data)
  }

  const getFormData = (): T => {
    return { ...form }
  }

  return {
    form,
    formRef,
    resetForm,
    fillForm,
    getFormData,
  }
}

/**
 * 表格选择 Hook
 */
export function useSelection() {
  const selectedRows = ref<any[]>([])
  const selectedIds = computed(() => selectedRows.value.map((item: any) => item.id))

  const handleSelectionChange = (rows: any[]) => {
    selectedRows.value = rows
  }

  const clearSelection = () => {
    selectedRows.value = []
  }

  const toggleSelection = (row: any) => {
    const index = selectedRows.value.findIndex((item: any) => item.id === row.id)
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    } else {
      selectedRows.value.push(row)
    }
  }

  return {
    selectedRows,
    selectedIds,
    handleSelectionChange,
    clearSelection,
    toggleSelection,
  }
}

/**
 * 本地存储 Hook
 */
export function useStorage<T>(key: string, defaultValue: T) {
  const storageKey = `storage_${key}`
  const { $ref } = getCurrentInstance()?.appContext.config.globalProperties || {}

  const getStoredValue = (): T => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const storedValue = ref(getStoredValue())

  const setStoredValue = (value: T) => {
    storedValue.value = value
    localStorage.setItem(storageKey, JSON.stringify(value))
  }

  const removeStoredValue = () => {
    storedValue.value = defaultValue
    localStorage.removeItem(storageKey)
  }

  // 监听变化
  watch(storedValue, (newValue) => {
    localStorage.setItem(storageKey, JSON.stringify(newValue))
  }, { deep: true })

  return {
    storedValue,
    setStoredValue,
    removeStoredValue,
  }
}

/**
 * 异步操作 Hook
 */
export function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: {
    immediate?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: any) => void
  } = {}
) {
  const { immediate = false, onSuccess, onError } = options

  const data = ref<T | null>(null)
  const loading = ref(immediate)
  const error = ref<any>(null)

  const execute = async (...args: any[]): Promise<T | null> => {
    loading.value = true
    error.value = null
    try {
      const result = await asyncFn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      error.value = e
      onError?.(e)
      return null
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
  }
}

/**
 * 倒计时 Hook
 */
export function useCountdown(initialSeconds: number = 60) {
  const seconds = ref(initialSeconds)
  const isCounting = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const startCountdown = () => {
    if (isCounting.value) return
    
    isCounting.value = true
    seconds.value = initialSeconds
    
    timer = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--
      } else {
        stopCountdown()
      }
    }, 1000)
  }

  const stopCountdown = () => {
    isCounting.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    seconds.value = initialSeconds
  }

  const resetCountdown = () => {
    stopCountdown()
    seconds.value = initialSeconds
  }

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })

  return {
    seconds,
    isCounting,
    startCountdown,
    stopCountdown,
    resetCountdown,
  }
}

/**
 * 标签页 Hook
 */
export function useTagsView() {
  const { router } = useRouter()
  const { message } = useMessage()

  const visitedViews = ref<any[]>([])
  const cachedViews = ref<string[]>([])

  const addVisitedView = (view: any) => {
    if (visitedViews.value.some((v: any) => v.path === view.path)) {
      return
    }
    visitedViews.value.push({
      name: view.name,
      path: view.path,
      fullPath: view.fullPath,
      title: view.meta?.title || 'no-title',
    })
  }

  const addCachedView = (view: any) => {
    const name = view.name
    if (name && !cachedViews.value.includes(name)) {
      cachedViews.value.push(name)
    }
  }

  const delVisitedView = (view: any) => {
    const index = visitedViews.value.findIndex((v: any) => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  const delCachedView = (view: any) => {
    const index = cachedViews.value.indexOf(view.name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  const goToView = (view: any) => {
    const index = visitedViews.value.findIndex((v: any) => v.path === view.path)
    if (index > -1) {
      router.push(visitedViews.value[index].fullPath)
    }
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    goToView,
  }
}

export default {
  useStatusParams,
  useSearch,
  usePagination,
  useDialog,
  useLoading,
  useForm,
  useSelection,
  useStorage,
  useAsync,
  useCountdown,
  useTagsView,
}
