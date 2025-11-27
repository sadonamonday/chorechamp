import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import TaskListItem from './TaskListItem';
import TaskDetailPanel from './TaskDetailPanel';

const AvailableTasksList = ({ tasks, onAcceptTask, currentUserId }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Extract unique categories and locations from tasks
    const categories = useMemo(() => {
        const cats = new Set();
        tasks.forEach(task => {
            if (task.category) cats.add(task.category);
        });
        return Array.from(cats);
    }, [tasks]);

    const locations = useMemo(() => {
        const locs = new Set();
        tasks.forEach(task => {
            if (task.location) locs.add(task.location);
        });
        return Array.from(locs);
    }, [tasks]);

    // Filter tasks based on search and filters
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Search filter
            const matchesSearch = !searchQuery ||
                task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Category filter
            const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

            // Location filter
            const matchesLocation = locationFilter === 'all' || task.location === locationFilter;

            // Price filter
            let matchesPrice = true;
            const price = parseFloat(task.budget || task.price_per_hour || 0);
            if (priceFilter === 'under100') matchesPrice = price < 100;
            else if (priceFilter === '100-500') matchesPrice = price >= 100 && price <= 500;
            else if (priceFilter === 'over500') matchesPrice = price > 500;

            return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
        });
    }, [tasks, searchQuery, categoryFilter, locationFilter, priceFilter]);

    // Auto-select first task when filtered tasks change
    React.useEffect(() => {
        if (filteredTasks.length > 0 && !selectedTask) {
            setSelectedTask(filteredTasks[0]);
        } else if (filteredTasks.length > 0 && selectedTask) {
            // Check if selected task is still in filtered list
            const stillExists = filteredTasks.find(t => t.id === selectedTask.id);
            if (!stillExists) {
                setSelectedTask(filteredTasks[0]);
            }
        } else if (filteredTasks.length === 0) {
            setSelectedTask(null);
        }
    }, [filteredTasks]);

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
    };

    return (
        <div className="flex h-[calc(100vh-250px)] bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Left Sidebar - Task List */}
            <div className="w-full md:w-2/5 border-r flex flex-col">
                {/* Search and Filters */}
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    {/* Search Bar */}
                    <div className="relative mb-3">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for a task"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <FaFilter className="mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-3 space-y-2">
                            {/* Category Filter */}
                            {categories.length > 0 && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Location Filter */}
                            {locations.length > 0 && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <select
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Any Location</option>
                                        {locations.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Price Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Price Range
                                </label>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Any Price</option>
                                    <option value="under100">Under R100</option>
                                    <option value="100-500">R100 - R500</option>
                                    <option value="over500">Over R500</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                            <div className="text-5xl mb-3">🔍</div>
                            <p className="text-center font-medium">No tasks found</p>
                            <p className="text-sm text-center mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskListItem
                                key={task.id}
                                task={task}
                                isSelected={selectedTask?.id === task.id}
                                onClick={() => handleTaskSelect(task)}
                            />
                        ))
                    )}
                </div>

                {/* Results Count */}
                <div className="p-3 border-t bg-gray-50 text-center text-sm text-gray-600">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                </div>
            </div>

            {/* Right Panel - Task Details */}
            <div className="hidden md:block md:w-3/5">
                <TaskDetailPanel
                    task={selectedTask}
                    onAcceptTask={onAcceptTask}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    );
};

export default AvailableTasksList;
