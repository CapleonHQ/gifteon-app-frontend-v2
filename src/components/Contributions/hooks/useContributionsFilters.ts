import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import type {
  ContributionSortBy,
  ContributionSortOrder,
  ContributionStatus,
  ContributionType,
  ContributionsQueryParams,
} from '@/types/Contributions'

const PAGE_SIZE = 20

type ContributionsFilterState = {
  type: 'all' | ContributionType
  status: 'all' | ContributionStatus
  fromDate?: Date
  toDate?: Date
  sortBy: ContributionSortBy
  sortOrder: ContributionSortOrder
}

const defaultFilterValues: ContributionsFilterState = {
  type: 'all',
  status: 'all',
  fromDate: undefined,
  toDate: undefined,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
}

const toApiDate = (value?: Date) => {
  if (!value) return undefined
  return format(value, 'yyyy-MM-dd')
}

export const useContributionsFilters = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterValues, setFilterValues] =
    useState<ContributionsFilterState>(defaultFilterValues)
  const [appliedFilterValues, setAppliedFilterValues] =
    useState<ContributionsFilterState>(defaultFilterValues)

  const queryParams: ContributionsQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: PAGE_SIZE,
      type: appliedFilterValues.type === 'all' ? undefined : appliedFilterValues.type,
      status:
        appliedFilterValues.status === 'all'
          ? undefined
          : appliedFilterValues.status,
      startDate: toApiDate(appliedFilterValues.fromDate),
      endDate: toApiDate(appliedFilterValues.toDate),
      sortBy: appliedFilterValues.sortBy,
      sortOrder: appliedFilterValues.sortOrder,
    }),
    [appliedFilterValues, currentPage]
  )

  const hasActiveFilters = Boolean(
    appliedFilterValues.type !== 'all' ||
      appliedFilterValues.status !== 'all' ||
      appliedFilterValues.fromDate ||
      appliedFilterValues.toDate ||
      appliedFilterValues.sortBy !== defaultFilterValues.sortBy ||
      appliedFilterValues.sortOrder !== defaultFilterValues.sortOrder
  )
  const activeFilterCount =
    (appliedFilterValues.type !== 'all' ? 1 : 0) +
    (appliedFilterValues.status !== 'all' ? 1 : 0) +
    (appliedFilterValues.fromDate || appliedFilterValues.toDate ? 1 : 0) +
    (appliedFilterValues.sortBy !== defaultFilterValues.sortBy ||
    appliedFilterValues.sortOrder !== defaultFilterValues.sortOrder
      ? 1
      : 0)

  const handleFilterChange = (next: ContributionsFilterState) => {
    setFilterValues(next)
  }

  const applyFilters = () => {
    setAppliedFilterValues(filterValues)
    setCurrentPage(1)
    setIsFilterOpen(false)
  }

  const resetAppliedFilters = () => {
    setFilterValues(defaultFilterValues)
    setAppliedFilterValues(defaultFilterValues)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    resetAppliedFilters()
  }

  return {
    currentPage,
    setCurrentPage,
    queryParams,
    hasActiveFilters,
    activeFilterCount,
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterChange,
    applyFilters,
    resetAppliedFilters,
    clearAllFilters,
  }
}
