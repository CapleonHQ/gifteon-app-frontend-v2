import { useMemo, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { type GiftsFilterState } from '@/types/Gifts/filters'
import { type PagesQueryParams } from '@/types/Pages'
import { buildFilterParams } from './filterParams'

const PAGE_SIZE = 20

export const useGiftsFilters = () => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue.trim(), 400)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>()
  const [filterToDate, setFilterToDate] = useState<Date | undefined>()
  const [filterStatus, setFilterStatus] = useState<GiftsFilterState['status']>(
    'all'
  )
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterVisibility, setFilterVisibility] = useState('all')
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<PagesQueryParams>({})
  const [offset, setOffset] = useState(0)

  const filterValues: GiftsFilterState = {
    fromDate: filterFromDate,
    toDate: filterToDate,
    status: filterStatus,
    category: filterCategory,
    visibility: filterVisibility,
  }

  const queryParams: PagesQueryParams = useMemo(
    () => ({
      ...appliedFilterParams,
      s: debouncedSearch || undefined,
      limit: PAGE_SIZE,
      offset,
    }),
    [appliedFilterParams, debouncedSearch, offset]
  )

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      appliedFilterParams.status ||
      appliedFilterParams.category ||
      appliedFilterParams.visibility ||
      appliedFilterParams.startdate ||
      appliedFilterParams.enddate
  )
  const activeFilterCount =
    (appliedFilterParams.status ? 1 : 0) +
    (appliedFilterParams.category ? 1 : 0) +
    (appliedFilterParams.visibility ? 1 : 0) +
    (appliedFilterParams.startdate || appliedFilterParams.enddate ? 1 : 0)

  const resetFilterForm = () => {
    setFilterFromDate(undefined)
    setFilterToDate(undefined)
    setFilterStatus('all')
    setFilterCategory('all')
    setFilterVisibility('all')
  }

  const clearAllFiltersAndSearch = () => {
    resetFilterForm()
    setAppliedFilterParams({})
    setSearchValue('')
    setOffset(0)
  }

  const handleFilterChange = (next: GiftsFilterState) => {
    setFilterFromDate(next.fromDate)
    setFilterToDate(next.toDate)
    setFilterStatus(next.status)
    setFilterCategory(next.category)
    setFilterVisibility(next.visibility)
  }

  const applyFilters = () => {
    setAppliedFilterParams(buildFilterParams(filterValues))
    setOffset(0)
    setIsFilterOpen(false)
  }

  const resetAppliedFilters = () => {
    resetFilterForm()
    setAppliedFilterParams({})
    setOffset(0)
  }

  const setSearchAndReset = (value: string) => {
    setSearchValue(value)
    setOffset(0)
  }

  return {
    searchValue,
    queryParams,
    offset,
    setOffset,
    hasActiveFilters,
    activeFilterCount,
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterChange,
    applyFilters,
    resetAppliedFilters,
    clearAllFiltersAndSearch,
    setSearchAndReset,
  }
}
