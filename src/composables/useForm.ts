import { reactive, ref, Ref, UnwrapRef } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

/**
 * 表单配置项
 */
export interface FormItem {
  type?: 'input' | 'select' | 'radio' | 'checkbox' | 'date' | 'datetime' | 'textarea' | 'number' | 'switch' | 'cascader' | 'tree'
  label: string
  prop: string
  options?: { label: string; value: any }[]
  attrs?: Record<string, any>
  rules?: any[]
  placeholder?: string
  width?: string | number
}

/**
 * 通用表单 Composable
 * @param options 配置选项
 */
export function useForm<T extends Record<string, any>>(
  options: {
    // 初始表单数据
    initialForm?: Partial<T>
    // 表单验证规则
    rules?: Record<string, any[]>
    // 提交函数
    onSubmit?: (form: T) => Promise<void>
    // 成功后是否重置表单
    resetAfterSubmit?: boolean
  } = {}
) {
  const {
    initialForm = {} as Partial<T>,
    rules = {},
    onSubmit,
    resetAfterSubmit = true,
  } = options

  // 表单 ref
  const formRef = ref<FormInstance>()
  
  // 表单数据
  const form = reactive<T>({ ...initialForm } as UnwrapRef<T> & T)
  
  // 加载状态
  const loading = ref(false)
  
  // 重置表单
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    } else {
      // 如果没有 formRef，手动重置
      Object.keys(form).forEach(key => {
        (form as any)[key] = initialForm[key] ?? getDefaultValue(initialForm[key])
      })
    }
  }
  
  // 获取默认值
  const getDefaultValue = (value: any) => {
    if (Array.isArray(value)) return []
    if (typeof value === 'number') return 0
    if (typeof value === 'boolean') return false
    return ''
  }
  
  // 填充表单数据
  const fillForm = (data: Partial<T>) => {
    Object.keys(data).forEach(key => {
      if ((form as any)[key] !== undefined) {
        (form as any)[key] = data[key]
      }
    })
  }
  
  // 验证表单
  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false
    return await formRef.value.validate().catch(() => false)
  }
  
  // 提交表单
  const handleSubmit = async () => {
    if (!onSubmit) {
      console.warn('未配置提交函数')
      return
    }
    
    const valid = await validate()
    if (!valid) return
    
    loading.value = true
    try {
      await onSubmit(form as T)
      ElMessage.success('操作成功')
      
      if (resetAfterSubmit) {
        resetForm()
      }
    } catch (error) {
      console.error('表单提交失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 关闭表单
  const closeForm = () => {
    resetForm()
  }
  
  return {
    // 数据
    formRef,
    form,
    loading,
    rules,
    // 方法
    resetForm,
    fillForm,
    validate,
    handleSubmit,
    closeForm,
  }
}

/**
 * 带弹窗的表单 Composable
 */
export function useDialogForm<T extends Record<string, any>>(
  options: {
    // 初始表单数据
    initialForm?: Partial<T>
    // 表单验证规则
    rules?: Record<string, any[]>
    // 提交函数
    onSubmit?: (form: T) => Promise<void>
    // 成功后是否重置表单
    resetAfterSubmit?: boolean
    // 弹窗标题
    dialogTitle?: {
      add: string
      edit: string
    }
  } = {}
) {
  const {
    initialForm = {} as Partial<T>,
    rules = {},
    onSubmit,
    resetAfterSubmit = true,
    dialogTitle = { add: '新增', edit: '编辑' },
  } = options

  // 弹窗显示状态
  const dialogVisible = ref(false)
  
  // 当前操作类型
  const dialogType = ref<'add' | 'edit'>('add')
  
  // 当前编辑的行数据
  const currentRow = ref<Partial<T>>()
  
  // 使用基础表单
  const {
    formRef,
    form,
    loading,
    rules: formRules,
    resetForm,
    fillForm,
    validate,
    handleSubmit,
  } = useForm<T>({
    initialForm,
    rules,
    onSubmit: async (formData) => {
      if (onSubmit) {
        await onSubmit(formData)
      }
      // 关闭弹窗
      dialogVisible.value = false
    },
    resetAfterSubmit,
  })
  
  // 打开新增弹窗
  const openAddDialog = () => {
    dialogType.value = 'add'
    currentRow.value = undefined
    resetForm()
    dialogVisible.value = true
  }
  
  // 打开编辑弹窗
  const openEditDialog = async (row: Partial<T>) => {
    dialogType.value = 'edit'
    currentRow.value = row
    await fillFormAsync(row)
    dialogVisible.value = true
  }
  
  // 异步填充表单（用于编辑时获取详情）
  const fillFormAsync = async (row: Partial<T>) => {
    resetForm()
    fillForm(row)
  }
  
  // 获取弹窗标题
  const getDialogTitle = () => {
    return dialogType.value === 'add' ? dialogTitle.add : dialogTitle.edit
  }
  
  // 关闭弹窗
  const handleClose = () => {
    dialogVisible.value = false
    resetForm()
  }
  
  return {
    // 数据
    dialogVisible,
    dialogType,
    currentRow,
    formRef,
    form,
    loading,
    rules: formRules,
    // 方法
    openAddDialog,
    openEditDialog,
    handleSubmit,
    handleClose,
    getDialogTitle,
    resetForm,
    fillForm,
    validate,
  }
}

/**
 * CRUD 操作 Composable
 */
export function useCrud<T extends Record<string, any>>(
  options: {
    // 获取列表函数
    fetchList: (params?: any) => Promise<any>
    // 删除函数
    fetchDelete?: (id: number | string) => Promise<void>
    // 新增函数
    fetchAdd?: (data: Partial<T>) => Promise<void>
    // 编辑函数
    fetchEdit?: (data: Partial<T>) => Promise<void>
    // 获取详情函数
    fetchDetail?: (id: number | string) => Promise<Partial<T>>
  }
) {
  const {
    fetchList,
    fetchDelete,
    fetchAdd,
    fetchEdit,
    fetchDetail,
  } = options

  // 使用表格列表
  const { tableData, pagination, searchParams, loading, getList, onSearch, onReset, onPaginationChange, onSizeChange } = useTable(fetchList)

  // 删除
  const handleDelete = async (id: number | string, confirmMessage: string = '确定要删除吗？') => {
    if (!fetchDelete) {
      console.warn('未配置删除函数')
      return
    }
    
    try {
      await ElMessageBox.confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      
      loading.value = true
      await fetchDelete(id)
      ElMessage.success('删除成功')
      getList()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    } finally {
      loading.value = false
    }
  }

  // 新增
  const handleAdd = async (data: Partial<T>) => {
    if (!fetchAdd) {
      console.warn('未配置新增函数')
      return
    }
    
    loading.value = true
    try {
      await fetchAdd(data)
      ElMessage.success('新增成功')
      getList()
    } catch (error) {
      console.error('新增失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 编辑
  const handleEdit = async (data: Partial<T>) => {
    if (!fetchEdit) {
      console.warn('未配置编辑函数')
      return
    }
    
    loading.value = true
    try {
      await fetchEdit(data)
      ElMessage.success('编辑成功')
      getList()
    } catch (error) {
      console.error('编辑失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取详情
  const getDetail = async (id: number | string): Promise<Partial<T> | undefined> => {
    if (!fetchDetail) {
      console.warn('未配置获取详情函数')
      return undefined
    }
    
    loading.value = true
    try {
      const data = await fetchDetail(id)
      return data
    } catch (error) {
      console.error('获取详情失败:', error)
      return undefined
    } finally {
      loading.value = false
    }
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
    handleDelete,
    handleAdd,
    handleEdit,
    getDetail,
  }
}
