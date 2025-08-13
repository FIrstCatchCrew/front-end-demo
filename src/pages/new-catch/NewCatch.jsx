import { useNewCatch } from '../../hooks/useNewCatch';
import './NewCatch.css';

const NewCatch = () => {
  const {
    formData,
    dropdownOptions,
    isLoading,
    isSubmitting,
    error,
    validationErrors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useNewCatch();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Add New Catch</h1>
        </div>
        <div className="page-content">
          <p>Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add New Catch</h1>
      </div>
      <div className="page-content">
        {error && (
        <div className="error-message">
          <div>Error: {error.message || 'Something went wrong'}</div>
          {error.payload && (
            <details className="error-payload">
              <summary>Request payload</summary>
              <pre className="error-payload-pre">
                {JSON.stringify(error.payload, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="new-catch-form">
        <div className="form-group">
          <label htmlFor="speciesId">Species *</label>
          <select
            id="speciesId"
            name="speciesId"
            value={formData.speciesId}
            onChange={handleInputChange}
            className={validationErrors.speciesId ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Select a species</option>
            {dropdownOptions.species.map(species => (
              <option key={species.id} value={species.id}>
                {species.name}
              </option>
            ))}
          </select>
          {validationErrors.speciesId && (
            <span className="validation-error">{validationErrors.speciesId}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fisherId">Fisher *</label>
          <select
            id="fisherId"
            name="fisherId"
            value={formData.fisherId}
            onChange={handleInputChange}
            className={validationErrors.fisherId ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Select a fisher</option>
            {dropdownOptions.fishers.map(fisher => (
              <option key={fisher.id} value={fisher.id}>
                {fisher.userName || fisher.username || `Fisher ${fisher.id}`}
              </option>
            ))}
          </select>
          {validationErrors.fisherId && (
            <span className="validation-error">{validationErrors.fisherId}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="landingId">Landing Port *</label>
          <select
            id="landingId"
            name="landingId"
            value={formData.landingId}
            onChange={handleInputChange}
            className={validationErrors.landingId ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Select a landing port</option>
            {dropdownOptions.landings.map(landing => (
              <option key={landing.id} value={landing.id}>
                {landing.name}
              </option>
            ))}
          </select>
          {validationErrors.landingId && (
            <span className="validation-error">{validationErrors.landingId}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantityInKg">Quantity (kg) *</label>
            <input
              type="number"
              id="quantityInKg"
              name="quantityInKg"
              value={formData.quantityInKg}
              onChange={handleInputChange}
              className={validationErrors.quantityInKg ? 'error' : ''}
              disabled={isSubmitting}
              min="0"
              step="0.1"
              placeholder="e.g. 2.5"
            />
            {validationErrors.quantityInKg && (
              <span className="validation-error">{validationErrors.quantityInKg}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pricePerKg">Price per kg ($) *</label>
            <input
              type="number"
              id="pricePerKg"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleInputChange}
              className={validationErrors.pricePerKg ? 'error' : ''}
              disabled={isSubmitting}
              min="0"
              step="0.01"
              placeholder="e.g. 25.99"
            />
            {validationErrors.pricePerKg && (
              <span className="validation-error">{validationErrors.pricePerKg}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={resetForm}
            className="reset-button"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Catch...' : 'Add Catch'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default NewCatch;
