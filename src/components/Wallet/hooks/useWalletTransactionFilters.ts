'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export const useWalletTransactionFilters = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebounce(searchQuery.trim(), 400)

  const hasActiveFilters = Boolean(
    debouncedSearch || typeFilter !== 'all' || statusFilter !== 'all'
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleTypeChange = (value: string) => {
    setTypeFilter(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  return {
    searchQuery,
    typeFilter,
    statusFilter,
    currentPage,
    debouncedSearch,
    hasActiveFilters,
    setCurrentPage,
    handleSearchChange,
    handleTypeChange,
    handleStatusChange,
    resetFilters,
  }
}
