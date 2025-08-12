import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { searchCatches } from '../services/CatchService';
import { getAllSpecies } from '../services/SpeciesService';
import { getAllLandings } from '../services/LandingService';
import { getAllFishers } from '../services/FisherService';

export function useAvailableCatches() {
    const [catches, setCatches] = useState([]);

    const [filterOptions, setFilterOptions] = useState({
        species: [],
        landings: [],
        fishers: []
    });

    const [filters, setFilters] = useState({
        species: '',
        landing: '',
        fisher: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const params = useParams();

    // Effect 1: Fetch options for dropdown filters (runs once)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [speciesData, landingsData, fishersData] = await Promise.all([
          getAllSpecies(),
          getAllLandings(),
          getAllFishers(),
        ]);
        
        setFilterOptions({
          species: speciesData,
          landings: landingsData,
          fishers: fishersData,
        });
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError(err); 
      }
    };
    fetchFilterOptions();
  }, []);

  // Effect 2: Fetch available catches based on filters (runs when filters change)
  useEffect(() => {
    const fetchCatches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the centralized searchCatches service function
        const data = await searchCatches(filters.species, filters.landing);
        setCatches(data);
      } catch (err) {
        console.error("Error fetching catches:", err);
        setError(err);
        setCatches([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatches();
  }, [filters]);

  // Effect 3: Sync URL params with filter state (runs when URL changes)
  useEffect(() => {
    if (params.filterType && params.filterValue) {
      setFilters(prev => ({
        ...prev,
        [params.filterType]: params.filterValue,
      }));
    }
  }, [params]);

  // A single handler to update the filters state and the URL
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));

    // Update URL - simplified for clarity
    if (value) {
      navigate(`/available-catches/${name}/${value}`);
    } else {
      navigate('/available-catches');
    }
  }, [navigate]);

  // Return everything the component needs to render
  return {
    catches,
    filters,
    filterOptions,
    isLoading,
    error,
    handleFilterChange,
  };
}