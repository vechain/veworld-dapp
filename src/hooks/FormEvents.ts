import { FormInstance } from "antd"
import { ChangeEvent, useState } from "react"

interface IErrors {
  name: string[]
  warning: []
  errors: []
}

function useFormEvents(form: FormInstance) {
  const [dirty, setDirty] = useState<string[]>([])
  const [focus, setFocus] = useState<string>("")

  const onFormFocus = (e: ChangeEvent<HTMLFormElement>) => {
    setFocus(e.target.name)
  }

  const onFormBlur = (e: ChangeEvent<HTMLFormElement>) => {
    setFocus("")
    if (!dirty.includes(e.target.name))
      setDirty([...(dirty || []), e.target.name])
  }

  const validateForm = async () => {
    try {
      await form.validateFields()
      form.submit()
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const names = e.errorFields.map((field: IErrors) => field.name[0])
      setDirty(names)
    }
  }

  const generateAntClasses = (name: string) => {
    const isFocus =
      focus === name ? "ant-form-item-focus" : "ant-form-item-blur"
    const isFill = form.getFieldValue(name)
      ? "ant-form-item-fill"
      : "ant-form-item-empty"
    const isDirty =
      dirty && dirty.includes(name)
        ? "ant-form-item-dirty"
        : "ant-form-item-clean"
    return `${isFocus} ${isFill} ${isDirty}`
  }

  return {
    dirty,
    focus,
    onFormFocus,
    onFormBlur,
    generateAntClasses,
    validateForm,
  }
}

export default useFormEvents
