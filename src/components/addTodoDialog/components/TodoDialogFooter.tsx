import React from 'react'
import { DialogClose, DialogFooter } from '../../ui/dialog'
import LoadingButton from '../../button/LoadingButton'
import { Button } from '../../ui/button'
import { UseFormReset } from 'react-hook-form';
import { CreateTodoSchema } from '@/schema/todoSchema';

interface TodoDialogFooter {
    isLoading: boolean;
    reset: UseFormReset<CreateTodoSchema>;
    submitButtonText: string;
}

const TodoDialogFooter = ({isLoading,reset,submitButtonText}:TodoDialogFooter) => {
  return (
    <DialogFooter>
    {isLoading ? (
      <LoadingButton />
    ) : (
      <>
        <DialogClose asChild>
          <Button variant={"destructive"} onClick={() => reset()}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="bg-blue-500">
          {submitButtonText}
        </Button>
      </>
    )}
  </DialogFooter>
  )
}

export default TodoDialogFooter