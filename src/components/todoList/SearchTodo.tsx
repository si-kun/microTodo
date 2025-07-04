import React from 'react'
import { Input } from '../ui/input'
import { useAtom } from 'jotai'
import { searchTodoTerm } from '@/atom/todo'

const SearchTodo = () => {

    const [searchTerm,setSearchTerm] = useAtom(searchTodoTerm)

    console.log("searchTodo", searchTerm)

  return (
    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search Todo...'  />)
}

export default SearchTodo