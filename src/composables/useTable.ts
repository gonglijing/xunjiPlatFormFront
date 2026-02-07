import { reactive, ref, Ref } from 'vue'

// 表格数据接口
export interface TableData {
  data: any[]
  total: number
  loading: boolean
  param: Record<string, any>
}

// 默认分页参数
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
}

/**
 * 通用表格列表 Composable
 * @param fetchFn 获取数据的函数
 * @param options 配置选项
 */
export function useTable<T = any>(
  fetchFn: (params: Record<string, any>) => Promise<{ list: T[]; total: number }>,
  options: {
    immediate?: boolean
    defaultPageSize?: number
    responseKey?: string
  } = {}
) {
  const { immediate = true, defaultPageSize = 10, responseKey = 'res' } = options

  // 表格数据
  const tableData = ref<T[]>([]) as Ref<T[]>
  
  // 分页数据
  const pagination = reactive({
    pageNum: 1,
    pageSize: defaultPageSize,
    total: 0,
  })

  // 搜索参数
  const searchParams = reactive<Record<string, any>>({})

  // 加载状态
  const loading = ref(false)

  // 重置分页
  const resetPagination = () => {
    pagination.pageNum = 1
    pagination.total = 0
  }

  // 获取数据
  const getList = async (pageNum?: number) => {
    if (typeof pageNum === 'number') {
      pagination.pageNum = pageNum
    }

    loading.value = true
    try {
      const params = {
        ...searchParams,
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      }
      
      const res = await fetchFn(params)
      
      if (res) {
        // 支持不同的返回格式
        if (Array.isArray(res)) {
          tableData.value = res
          pagination.total = res.length
        } else if (res.list) {
          tableData.value = res.list
          pagination.total = res.total || 0
        } else if (responseKey && res[responseKey]) {
          const resData = res[responseKey]
          tableData.value = Array.isArray(resData) ? resData : resData.list || []
          pagination.total = res.total || resData.total || 0
        } else {
          // 兜底：尝试从 res 中提取
          tableData.value = (res as any).list || (res as any).data || []
          pagination.total = (res as any).total || (res as any).count || 0
        }
      }
    } catch (error) {
      console.error('获取列表数据失败:', error)
      tableData.value = []
      pagination.total = 0
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const onSearch = () => {
    resetPagination()
    getList()
  }

  // 重置搜索
  const onReset = () => {
    // 清空搜索参数
    Object.keys(searchParams).forEach(key => {
      delete searchParams[key]
    })
    resetPagination()
    getList()
  }

  // 分页改变
  const onPaginationChange = (page: number) => {
    getList(page)
  }

  // 每页条数改变
  const onSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.pageNum = 1
    getList()
  }

  // 初始化
  if (immediate) {
    getList()
  }

  return {
    // 数据
    tableData,
    pagination,
    searchParams,
    loading,
    // 方法
    getList,
    onSearch,
    onReset,
    onPaginationChange,
    onSizeChange,
    resetPagination,
  }
}

/**
 * 简单表格列表（不带分页）
 */
export function useSimpleTable<T = any>(
  fetchFn: (params?: Record<string, any>) => Promise<T[]>
) {
  const tableData = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const searchParams = reactive<Record<string, any>>({})

  const getList = async () => {
    loading.value = true
    try {
      const res = await fetchFn(searchParams)
      tableData.value = Array.isArray(res) ? res : []
    } catch (error) {
      console.error('获取数据失败:', error)
      tableData.value = []
    } finally {
      loading.value = false
    }
  }

  const onSearch = () => {
    getList()
  }

  const onReset = () => {
    Object.keys(searchParams).forEach(key => {
      delete searchParams[key]
    })
    getList()
  }

  return {
    tableData,
    searchParams,
    loading,
    getList,
    onSearch,
    onReset,
  }
}
