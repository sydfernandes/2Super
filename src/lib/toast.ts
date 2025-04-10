import { toast } from 'sonner'

// Standard success toast
export const toastSuccess = (message: string) => {
  toast.success(message)
}

// Standard error toast
export const toastError = (message: string) => {
  toast.error(message)
}

// Standard info toast
export const toastInfo = (message: string) => {
  toast.info(message)
}

// Standard warning toast
export const toastWarning = (message: string) => {
  toast.warning(message)
}

// Promise toast for handling async operations
export const toastPromise = <T,>(
  promise: Promise<T>,
  options: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: unknown) => string)
  }
) => {
  return toast.promise(promise, {
    loading: options.loading,
    success: options.success,
    error: options.error,
  })
}

// Action feedback function for handling common CRUD operations
export const toastAction = (
  action: 'create' | 'update' | 'delete' | 'save',
  options: {
    resource: string
    success?: boolean
    error?: Error | null
  }
) => {
  const { resource, success = true, error = null } = options
  
  const messages = {
    create: {
      success: `${resource} creado con éxito.`,
      error: `No se pudo crear ${resource.toLowerCase()}.`
    },
    update: {
      success: `${resource} actualizado con éxito.`,
      error: `No se pudo actualizar ${resource.toLowerCase()}.`
    },
    delete: {
      success: `${resource} eliminado con éxito.`,
      error: `No se pudo eliminar ${resource.toLowerCase()}.`
    },
    save: {
      success: `${resource} guardado con éxito.`,
      error: `No se pudo guardar ${resource.toLowerCase()}.`
    }
  }
  
  if (success) {
    toast.success(messages[action].success)
  } else {
    toast.error(
      error?.message 
        ? `${messages[action].error} ${error.message}` 
        : messages[action].error
    )
  }
} 