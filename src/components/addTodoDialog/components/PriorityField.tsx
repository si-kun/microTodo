import React from 'react'
import { Label } from '../../ui/label'
import { Control, Controller } from 'react-hook-form'
import { PRIORITY_OPTIONS } from '@/constants/priority'
import { Card } from '../../ui/card'
import { CreateTodoSchema } from '@/schema/todoSchema'

interface PriorityFieldProps {
    control: Control<CreateTodoSchema>
    isReadOnly: boolean
}

const PriorityField = ({control,isReadOnly}:PriorityFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
    <Label>優先度を選択</Label>
    <Controller
      control={control}
      name="priority"
      render={({ field }) => (
        <div className="grid grid-cols-3 gap-4">
          {PRIORITY_OPTIONS.map((option) => (
            <Card
              key={option.value}
              role='radio'
              className={`text-center cursor-pointer border-2 ${
                field.value === option.value
                  ? `${option.borderClass} ${option.bgClass} ${option.hoverClass}` // 選択されている場合のスタイル
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={
                isReadOnly
                  ? undefined
                  : () => field.onChange(option.value)
              }
            >
              <span className="font-bold">{option.label}</span>
            </Card>
          ))}
        </div>
      )}
    />
  </div>
  )
}

export default PriorityField