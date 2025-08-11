import { useAvailableCatches } from '../../hooks/UseAvailableCatches';
import FilterSelectionDropdown from "../../components/Filter-Selection-Dropdown/FilterSelectionDropdown";
import SpeciesTooltip from '../../components/species-tooltip/SpeciesTooltip';
import FisherTooltip from '../../components/fisher-tooltip/FisherTooltip';
import './AvailableCatches.css';

const AvailableCatches = () => {
  const {
    catches,
    filters,
    filterOptions,
    isLoading,
    error,
    handleFilterChange,
  } = useAvailableCatches();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Available Catches</h1>
      </div>
      <div className="page-content">
        <div className="filters-container">
          <FilterSelectionDropdown
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            options={filterOptions.species}
            defaultOptionLabel="All Species"
          />
          <FilterSelectionDropdown
            name="landing"
            value={filters.landing}
            onChange={handleFilterChange}
            options={filterOptions.landings}
            defaultOptionLabel="All Landings"
          />
          <FilterSelectionDropdown
            name="fisher"
            value={filters.fisher}
            onChange={handleFilterChange}
            options={filterOptions.fishers.map(f => ({ id: f.id, name: f.userName }))}
            defaultOptionLabel="All Fishers"
          />
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading data: {error.message}</p>}
        {!isLoading && !error && (
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
                catches.map(c => {
                  // Find species data for this catch
                  const speciesInfo = filterOptions.species.find(s => s.name === c.speciesName);
                  // Find fisher data for this catch
                  const fisherInfo = filterOptions.fishers.find(f => f.person?.username === c.fisherName || f.userName === c.fisherName);
                  
                  return (
                    <tr key={c.id}>
                      <td>
                        <SpeciesTooltip 
                          speciesName={c.speciesName} 
                          speciesData={speciesInfo}
                        />
                      </td>
                      <td>{c.quantityInKg}</td>
                      <td>${c.pricePerKg.toFixed(2)}</td>
                      <td>
                        <FisherTooltip 
                          fisherName={c.fisherName} 
                          fisherData={fisherInfo}
                        />
                      </td>
                      <td>{c.landingName}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">No catches match your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AvailableCatches;
