import React from 'react';
import { ListFilter, Calendar, Tag } from 'lucide-react';

// Define the shape of our filters state
export interface Filters {
  dateRange: string;
  category: string;
}

interface NewsFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({ filters, onFilterChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <ListFilter size={20} />
          <span>Filter News</span>
        </h3>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-500" />
          <select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-gray-500" />
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Politics">Politics</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Science">Science</option>
          </select>
        </div>
      </div>
    </div>
  );
};