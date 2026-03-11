import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="search-wrapper">
            <Search className="search-icon" />
            <input
                type="text"
                className="input"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
