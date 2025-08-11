import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FilterSelectionDropdown from "../../components/Filter-Selection-Dropdown/FilterSelectionDropdown";
import './AvailableCatches.css';

const AvailableCatches = () => {
  const [catches, setCatches] = React.useState([]);

  const [speciesFilter, setSpeciesFilter] = React.useState([])
  const [landingsFilter, setLandingsFilter] = React.useState([])
  const [fisherFilter, setFisherFilter] = React.useState([])

  const [filterCatch, setFilterCatch] = React.useState({
    species: '',
    landings: '',
    fisher: ''
  });

  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();
  const params = useParams();

  // Effect 1: fetch options for dropdown filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [speciesResponse, landingsResponse, fisherResponse] = await Promise.all([
          fetch(import.meta.env.VITE_SPECIES_ENDPOINT),
          fetch(import.meta.env.VITE_LANDING_ENDPOINT),
          fetch(`${import.meta.env.VITE_USER_ENDPOINT}/fishers`),
     ]);
        const speciesData = await speciesResponse.json();
        const landingsData = await landingsResponse.json();
        const fisherData = await fisherResponse.json();

        setSpeciesFilter(speciesData);
        setLandingsFilter(landingsData);
        setFisherFilter(fisherData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

// Effect 2: fetch available catches based on filters
useEffect(() => {
  const fetchCatches = async () => {
    setIsLoading(true);
    let url = import.meta.env.VITE_CATCH_ENDPOINT;
    const {species, landing, fisher} = filterCatch;
    if (species && landing) {
      url += `/search?speciesName=${species}&landingName=${landing}`;
    }else if (species) {
      url += `/search?speciesName=${species}`;
    }else if (landing) {
      url += `/search?landingName=${landing}`;
    }else if (fisher) {
      url += `/search?fisherName=${fisher}`;
    } else {
      url += `available`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCatches(data);
    } catch (error) {
      console.error("Error fetching catches:", error);
      setCatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchCatches();
}, [filterCatch]);

// Effect 3: sync URL params with filter state
useEffect(() => {
  if (params.filtertype && params.filterValue) {
    setFilterCatch(prev => ({
      ...prev,
      [params.filtertype]: params.filterValue
    }));
  }
  }, [params]);

  // EVENT HANDLERS

  //A single handler to update the filters state and the URL
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    const newFilters = { ...filterCatch, [name]: value };
    setFilterCatch(newFilters);

    if(value) {
      navigate(`/available-catches/${name}/${value}`);
    }else {
      navigate('/available-catches');
    }
  };

  // RENDER

  return (
    <div className="marketplace-container">
      <h2>Available Catches</h2>

      <div className="filters-container">
        {/* 2. Replace the old <select> tags with the new component */}
        <FilterSelectionDropdown
          name="species"
          value={filterCatch.species}
          onChange={handleFilterChange}
          options={speciesFilter}
          defaultOptionLabel="All Species"
        />
        <FilterSelectionDropdown
          name="landing"
          value={filterCatch.landing}
          onChange={handleFilterChange}
          options={landingsFilter}
          defaultOptionLabel="All Landings"
        />
        <FilterSelectionDropdown
          name="fisher"
          value={filterCatch.fisher}
          onChange={handleFilterChange}
          // The component expects 'name', but our fisher object has 'username'.
          // To fix this, we'll map it to the expected format.
          options={fisherFilter.map(f => ({ id: f.id, name: f.username }))}
          defaultOptionLabel="All Fishers"
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Quantity (kg)</th>
              <th>Price/kg</th>
              <th>Fisher</th>
              <th>Landing Port</th>
            </tr>
          </thead>
          <tbody>
            {catches.length > 0 ? (
              catches.map(c => (
                <tr key={c.id}>
                  <td>{c.speciesName}</td>
                  <td>{c.quantityInKg}</td>
                  <td>${c.pricePerKg.toFixed(2)}</td>
                  <td>{c.fisherName}</td>
                  <td>{c.landingName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No catches match your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AvailableCatches;
