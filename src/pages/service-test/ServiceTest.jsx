import React, { useState } from "react";
import './ServiceTest.css';
import { 
  getAllCatches, 
  getAvailableCatches, 
  getCatchById, 
  getCatchesBySpeciesName,
  searchCatches,
  createCatch,
  updateCatch,
  refreshAllAvailability,
  deleteCatchById
} from '../../services/CatchService';
import { 
  getAllFishers, 
  getFisherById, 
  getCatchesByFisherId,
  getExpiredUnsoldCatchesByFisherId,
  getSoldCatchesByFisherId,
  createFisher,
  updateFisher,
  deleteFisherById
} from '../../services/FisherService';
import { 
  getAllSpecies, 
  getSpeciesById, 
  createSpecies,
  updateSpecies,
  deleteSpeciesById
} from '../../services/SpeciesService';
import {
  getAllLandings,
  getLandingById,
  createLanding,
  updateLanding,
  deleteLandingById
} from '../../services/LandingService';
import {
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  createOrder,
  updateOrder,
  deleteOrderById
} from '../../services/OrderService';
import {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItemById
} from '../../services/OrderItemService';
import {
  getAllPersons,
  getPersonsByRoleType,
  getRoleTypeByPersonId,
  getPersonById,
  getPersonByUsername,
  loginPerson,
  createPerson,
  updatePerson,
  deletePersonById
} from '../../services/PersonService';
import {
  getAllUserRoles,
  getUserRoleById,
  getUserRoleByType,
  createUserRole,
  updateUserRole,
  deleteUserRoleById,
  UserRoleType
} from '../../services/UserRoleService';

const ServiceTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [inputValues, setInputValues] = useState({
    catchId: '',
    fisherId: '',
    speciesId: '',
    landingId: '',
    orderId: '',
    orderItemId: '',
    personId: '',
    userRoleId: '',
    username: '',
    customerUsername: '',
    speciesName: '',
    landingName: '',
    roleType: 'ADMIN',
    userRoleType: 'ADMIN',
    credentials: {
      username: '',
      password: ''
    },
    newCatch: {
      speciesId: '',
      fisherId: '',
      landingId: '',
      quantity: '',
      pricePerKg: '',
      dateCaught: ''
    },
    updateCatch: {
      speciesId: '',
      fisherId: '',
      landingId: '',
      quantity: '',
      pricePerKg: '',
      dateCaught: ''
    },
    newFisher: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    },
    updateFisher: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    },
    newSpecies: {
      name: '',
      description: ''
    },
    updateSpecies: {
      name: '',
      description: ''
    },
    newLanding: {
      name: '',
      location: '',
      description: ''
    },
    updateLanding: {
      name: '',
      location: '',
      description: ''
    },
    newOrder: {
      customerUsername: '',
      totalAmount: '',
      orderDate: ''
    },
    updateOrder: {
      customerUsername: '',
      totalAmount: '',
      orderDate: ''
    },
    newOrderItem: {
      orderId: '',
      catchId: '',
      quantity: '',
      pricePerKg: ''
    },
    updateOrderItem: {
      orderId: '',
      catchId: '',
      quantity: '',
      pricePerKg: ''
    },
    newPerson: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userRoleId: ''
    },
    updatePerson: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userRoleId: ''
    },
    newUserRole: {
      roleType: 'CUSTOMER',
      description: ''
    },
    updateUserRole: {
      roleType: 'CUSTOMER',
      description: ''
    }
  });

  const testEndpoint = async (endpointName, apiCall) => {
    setLoading(prev => ({ ...prev, [endpointName]: true }));
    try {
      const result = await apiCall();
      setTestResults(prev => ({ 
        ...prev, 
        [endpointName]: { 
          success: true, 
          data: result,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    } catch (error) {
      console.error(`Detailed error for ${endpointName}:`, error);
      
      // Enhanced error handling with more details
      let errorDetails = {
        message: error.message,
        type: error.constructor.name,
        timestamp: new Date().toLocaleTimeString()
      };

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorDetails.possibleCause = 'Network error - Check if the API endpoint URL is correct and the server is running';
        errorDetails.debugInfo = {
          errorType: 'Network/CORS Error',
          suggestion: 'Verify environment variables and server status'
        };
      }
      
      // Check if it's a fetch error with more details
      if (error.message.includes('HTTP error!')) {
        errorDetails.debugInfo = {
          errorType: 'HTTP Error',
          suggestion: 'Server responded with an error - check request format and server logs'
        };
      }
      
      // Check for specific error patterns
      if (error.message.includes('Failed to fetch')) {
        errorDetails.possibleCause = 'CORS, Network, or Invalid URL error';
        errorDetails.debugInfo = {
          errorType: 'Fetch Failed',
          commonCauses: [
            'CORS policy blocking request',
            'Invalid or undefined API endpoint URL',
            'Server not running or unreachable',
            'Network connectivity issues'
          ]
        };
      }

      // Add environment variable debugging
      const envVars = {
        VITE_CATCH_ENDPOINT: import.meta.env.VITE_CATCH_ENDPOINT,
        VITE_FISHER_ENDPOINT: import.meta.env.VITE_FISHER_ENDPOINT,
        VITE_SPECIES_ENDPOINT: import.meta.env.VITE_SPECIES_ENDPOINT,
        VITE_LANDING_ENDPOINT: import.meta.env.VITE_LANDING_ENDPOINT,
        VITE_ORDER_ENDPOINT: import.meta.env.VITE_ORDER_ENDPOINT,
        VITE_ORDER_ITEM_ENDPOINT: import.meta.env.VITE_ORDER_ITEM_ENDPOINT,
        VITE_PERSON_ENDPOINT: import.meta.env.VITE_PERSON_ENDPOINT,
        VITE_USER_ROLE_ENDPOINT: import.meta.env.VITE_USER_ROLE_ENDPOINT
      };

      errorDetails.environmentVariables = envVars;
      errorDetails.undefinedEndpoints = Object.entries(envVars)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      setTestResults(prev => ({ 
        ...prev, 
        [endpointName]: { 
          success: false, 
          error: errorDetails,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpointName]: false }));
    }
  };

  const updateInputValue = (path, value) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      setInputValues(prev => ({ ...prev, [keys[0]]: value }));
    } else {
      setInputValues(prev => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value }
      }));
    }
  };

  const renderTestResult = (endpointName) => {
    const result = testResults[endpointName];
    if (!result) return null;

    const formatErrorContent = (error) => {
      if (typeof error === 'string') {
        return error;
      }
      
      // Format the enhanced error object for better readability
      let formattedError = `Error: ${error.message}\n`;
      formattedError += `Type: ${error.type}\n\n`;
      
      if (error.possibleCause) {
        formattedError += `Possible Cause: ${error.possibleCause}\n\n`;
      }
      
      if (error.debugInfo) {
        formattedError += `Debug Info:\n`;
        formattedError += `  Error Type: ${error.debugInfo.errorType}\n`;
        if (error.debugInfo.suggestion) {
          formattedError += `  Suggestion: ${error.debugInfo.suggestion}\n`;
        }
        if (error.debugInfo.commonCauses) {
          formattedError += `  Common Causes:\n`;
          error.debugInfo.commonCauses.forEach(cause => {
            formattedError += `    • ${cause}\n`;
          });
        }
        formattedError += '\n';
      }
      
      if (error.undefinedEndpoints && error.undefinedEndpoints.length > 0) {
        formattedError += `Undefined Environment Variables:\n`;
        error.undefinedEndpoints.forEach(env => {
          formattedError += `  • ${env}\n`;
        });
        formattedError += '\n';
      }
      
      formattedError += `Environment Variables:\n`;
      Object.entries(error.environmentVariables).forEach(([key, value]) => {
        formattedError += `  ${key}: ${value || 'UNDEFINED'}\n`;
      });
      
      return formattedError;
    };

    return (
      <div className={`test-result ${result.success ? 'success' : 'error'}`}>
        <div className="result-header">
          <span className="timestamp">{result.timestamp}</span>
          <span className={`status ${result.success ? 'success' : 'error'}`}>
            {result.success ? 'Success' : 'Error'}
          </span>
        </div>
        <pre className="result-content">
          {result.success 
            ? JSON.stringify(result.data, null, 2)
            : formatErrorContent(result.error)
          }
        </pre>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">API Endpoint Testing</h1>
        <p>Test your FishCatch service endpoints to ensure they're working correctly.</p>
      </div>
      
      <div className="page-content">
        <div className="api-test-container">
          
          {/* Environment Variables Debug Section */}
          <div className="service-section debug-section">
            <h3>Configuration Debug</h3>
            <div className="debug-info">
              <h4>Environment Variables Status:</h4>
              <div className="env-vars-grid">
                <div className={`env-var ${import.meta.env.VITE_CATCH_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_CATCH_ENDPOINT:</strong> {import.meta.env.VITE_CATCH_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_CATCH_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_CATCH_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_FISHER_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_FISHER_ENDPOINT:</strong> {import.meta.env.VITE_FISHER_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_FISHER_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_FISHER_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_SPECIES_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_SPECIES_ENDPOINT:</strong> {import.meta.env.VITE_SPECIES_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_SPECIES_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_SPECIES_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_LANDING_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_LANDING_ENDPOINT:</strong> {import.meta.env.VITE_LANDING_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_LANDING_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_LANDING_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_ORDER_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_ORDER_ENDPOINT:</strong> {import.meta.env.VITE_ORDER_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_ORDER_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_ORDER_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_ORDER_ITEM_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_ORDER_ITEM_ENDPOINT:</strong> {import.meta.env.VITE_ORDER_ITEM_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_ORDER_ITEM_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_ORDER_ITEM_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_PERSON_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_PERSON_ENDPOINT:</strong> {import.meta.env.VITE_PERSON_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_PERSON_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_PERSON_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
                <div className={`env-var ${import.meta.env.VITE_USER_ROLE_ENDPOINT ? 'defined' : 'undefined'}`}>
                  <strong>VITE_USER_ROLE_ENDPOINT:</strong> {import.meta.env.VITE_USER_ROLE_ENDPOINT || 'UNDEFINED'}
                  {import.meta.env.VITE_USER_ROLE_ENDPOINT && (
                    <div className="test-url">
                      <button 
                        onClick={() => window.open(import.meta.env.VITE_USER_ROLE_ENDPOINT, '_blank')}
                        className="url-test-button"
                      >
                        Test URL
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="debug-help">
                <p><strong>Tip:</strong> If any endpoints show as "UNDEFINED", create or update your <code>.env</code> file in the project root with the missing variables.</p>
                <p><strong>URL Testing:</strong> Click "Test URL" buttons above to open endpoints in a new tab and see what they return.</p>
                <p><strong>Example .env file:</strong></p>
                <pre className="env-example">
VITE_CATCH_ENDPOINT=http://localhost:8080/api/catch
VITE_FISHER_ENDPOINT=http://localhost:8080/api/fisher
VITE_SPECIES_ENDPOINT=http://localhost:8080/api/species
VITE_LANDING_ENDPOINT=http://localhost:8080/api/landing
VITE_ORDER_ENDPOINT=http://localhost:8080/api/order
VITE_ORDER_ITEM_ENDPOINT=http://localhost:8080/api/order-item
VITE_PERSON_ENDPOINT=http://localhost:8080/api/person
VITE_USER_ROLE_ENDPOINT=http://localhost:8080/api/role
                </pre>
                <div className="common-issues">
                  <h5> Common Issues:</h5>
                  <ul>
                    <li><strong>HTML instead of JSON:</strong> Usually means wrong URL or server not running</li>
                    <li><strong>CORS errors:</strong> Backend needs to allow your frontend domain</li>
                    <li><strong>404 errors:</strong> API endpoint doesn't exist or wrong path</li>
                    <li><strong>Connection refused:</strong> Backend server is not running</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Catch Service Tests */}
          <div className="service-section">
            <h3>Catch Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllCatches', getAllCatches)}
                disabled={loading.getAllCatches}
                className="test-button"
              >
                {loading.getAllCatches ? 'Testing...' : 'Get All Catches'}
              </button>
              
              <button 
                onClick={() => testEndpoint('getAvailableCatches', getAvailableCatches)}
                disabled={loading.getAvailableCatches}
                className="test-button"
              >
                {loading.getAvailableCatches ? 'Testing...' : 'Get Available Catches'}
              </button>
              
              <button 
                onClick={() => testEndpoint('refreshAllAvailability', refreshAllAvailability)}
                disabled={loading.refreshAllAvailability}
                className="test-button refresh-button"
              >
                {loading.refreshAllAvailability ? 'Refreshing...' : 'Refresh All Availability'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Catch ID"
                  value={inputValues.catchId}
                  onChange={(e) => updateInputValue('catchId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getCatchById', () => getCatchById(inputValues.catchId))}
                  disabled={loading.getCatchById || !inputValues.catchId}
                  className="test-button"
                >
                  {loading.getCatchById ? 'Testing...' : 'Get Catch by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteCatchById', () => deleteCatchById(inputValues.catchId))}
                  disabled={loading.deleteCatchById || !inputValues.catchId}
                  className="test-button delete-button"
                >
                  {loading.deleteCatchById ? 'Deleting...' : 'Delete Catch'}
                </button>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Species Name"
                  value={inputValues.speciesName}
                  onChange={(e) => updateInputValue('speciesName', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getCatchesBySpeciesName', () => getCatchesBySpeciesName(inputValues.speciesName))}
                  disabled={loading.getCatchesBySpeciesName || !inputValues.speciesName}
                  className="test-button"
                >
                  {loading.getCatchesBySpeciesName ? 'Testing...' : 'Get Catches by Species'}
                </button>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Species Name (optional)"
                  value={inputValues.speciesName}
                  onChange={(e) => updateInputValue('speciesName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Landing Name (optional)"
                  value={inputValues.landingName}
                  onChange={(e) => updateInputValue('landingName', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('searchCatches', () => searchCatches(inputValues.speciesName, inputValues.landingName))}
                  disabled={loading.searchCatches}
                  className="test-button"
                >
                  {loading.searchCatches ? 'Searching...' : 'Search Catches'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllCatches')}
            {renderTestResult('getAvailableCatches')}
            {renderTestResult('refreshAllAvailability')}
            {renderTestResult('getCatchById')}
            {renderTestResult('deleteCatchById')}
            {renderTestResult('getCatchesBySpeciesName')}
            {renderTestResult('searchCatches')}
          </div>

          {/* Fisher Service Tests */}
          <div className="service-section">
            <h3>Fisher Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllFishers', getAllFishers)}
                disabled={loading.getAllFishers}
                className="test-button"
              >
                {loading.getAllFishers ? 'Testing...' : 'Get All Fishers'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Fisher ID"
                  value={inputValues.fisherId}
                  onChange={(e) => updateInputValue('fisherId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getFisherById', () => getFisherById(inputValues.fisherId))}
                  disabled={loading.getFisherById || !inputValues.fisherId}
                  className="test-button"
                >
                  {loading.getFisherById ? 'Testing...' : 'Get Fisher by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('getCatchesByFisherId', () => getCatchesByFisherId(inputValues.fisherId))}
                  disabled={loading.getCatchesByFisherId || !inputValues.fisherId}
                  className="test-button"
                >
                  {loading.getCatchesByFisherId ? 'Testing...' : 'Get Fisher Catches'}
                </button>
                <button 
                  onClick={() => testEndpoint('getExpiredUnsoldCatchesByFisherId', () => getExpiredUnsoldCatchesByFisherId(inputValues.fisherId))}
                  disabled={loading.getExpiredUnsoldCatchesByFisherId || !inputValues.fisherId}
                  className="test-button"
                >
                  {loading.getExpiredUnsoldCatchesByFisherId ? 'Testing...' : 'Get Expired Catches'}
                </button>
                <button 
                  onClick={() => testEndpoint('getSoldCatchesByFisherId', () => getSoldCatchesByFisherId(inputValues.fisherId))}
                  disabled={loading.getSoldCatchesByFisherId || !inputValues.fisherId}
                  className="test-button"
                >
                  {loading.getSoldCatchesByFisherId ? 'Testing...' : 'Get Sold Catches'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteFisherById', () => deleteFisherById(inputValues.fisherId))}
                  disabled={loading.deleteFisherById || !inputValues.fisherId}
                  className="test-button delete-button"
                >
                  {loading.deleteFisherById ? 'Deleting...' : 'Delete Fisher'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllFishers')}
            {renderTestResult('getFisherById')}
            {renderTestResult('getCatchesByFisherId')}
            {renderTestResult('getExpiredUnsoldCatchesByFisherId')}
            {renderTestResult('getSoldCatchesByFisherId')}
            {renderTestResult('deleteFisherById')}
          </div>

          {/* Species Service Tests */}
          <div className="service-section">
            <h3>Species Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllSpecies', getAllSpecies)}
                disabled={loading.getAllSpecies}
                className="test-button"
              >
                {loading.getAllSpecies ? 'Testing...' : 'Get All Species'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Species ID"
                  value={inputValues.speciesId}
                  onChange={(e) => updateInputValue('speciesId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getSpeciesById', () => getSpeciesById(inputValues.speciesId))}
                  disabled={loading.getSpeciesById || !inputValues.speciesId}
                  className="test-button"
                >
                  {loading.getSpeciesById ? 'Testing...' : 'Get Species by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteSpeciesById', () => deleteSpeciesById(inputValues.speciesId))}
                  disabled={loading.deleteSpeciesById || !inputValues.speciesId}
                  className="test-button delete-button"
                >
                  {loading.deleteSpeciesById ? 'Deleting...' : 'Delete Species'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllSpecies')}
            {renderTestResult('getSpeciesById')}
            {renderTestResult('deleteSpeciesById')}
          </div>

          {/* Landing Service Tests */}
          <div className="service-section">
            <h3>Landing Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllLandings', getAllLandings)}
                disabled={loading.getAllLandings}
                className="test-button"
              >
                {loading.getAllLandings ? 'Testing...' : 'Get All Landings'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Landing ID"
                  value={inputValues.landingId}
                  onChange={(e) => updateInputValue('landingId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getLandingById', () => getLandingById(inputValues.landingId))}
                  disabled={loading.getLandingById || !inputValues.landingId}
                  className="test-button"
                >
                  {loading.getLandingById ? 'Testing...' : 'Get Landing by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteLandingById', () => deleteLandingById(inputValues.landingId))}
                  disabled={loading.deleteLandingById || !inputValues.landingId}
                  className="test-button delete-button"
                >
                  {loading.deleteLandingById ? 'Deleting...' : 'Delete Landing'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllLandings')}
            {renderTestResult('getLandingById')}
            {renderTestResult('deleteLandingById')}
          </div>

          {/* Order Service Tests */}
          <div className="service-section">
            <h3>Order Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllOrders', getAllOrders)}
                disabled={loading.getAllOrders}
                className="test-button"
              >
                {loading.getAllOrders ? 'Testing...' : 'Get All Orders'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Order ID"
                  value={inputValues.orderId}
                  onChange={(e) => updateInputValue('orderId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getOrderById', () => getOrderById(inputValues.orderId))}
                  disabled={loading.getOrderById || !inputValues.orderId}
                  className="test-button"
                >
                  {loading.getOrderById ? 'Testing...' : 'Get Order by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteOrderById', () => deleteOrderById(inputValues.orderId))}
                  disabled={loading.deleteOrderById || !inputValues.orderId}
                  className="test-button delete-button"
                >
                  {loading.deleteOrderById ? 'Deleting...' : 'Delete Order'}
                </button>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Customer Username"
                  value={inputValues.customerUsername}
                  onChange={(e) => updateInputValue('customerUsername', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getOrdersByCustomer', () => getOrdersByCustomer(inputValues.customerUsername))}
                  disabled={loading.getOrdersByCustomer || !inputValues.customerUsername}
                  className="test-button"
                >
                  {loading.getOrdersByCustomer ? 'Testing...' : 'Get Orders by Customer'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllOrders')}
            {renderTestResult('getOrderById')}
            {renderTestResult('deleteOrderById')}
            {renderTestResult('getOrdersByCustomer')}
          </div>

          {/* Order Item Service Tests */}
          <div className="service-section">
            <h3>Order Item Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllOrderItems', getAllOrderItems)}
                disabled={loading.getAllOrderItems}
                className="test-button"
              >
                {loading.getAllOrderItems ? 'Testing...' : 'Get All Order Items'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Order Item ID"
                  value={inputValues.orderItemId}
                  onChange={(e) => updateInputValue('orderItemId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getOrderItemById', () => getOrderItemById(inputValues.orderItemId))}
                  disabled={loading.getOrderItemById || !inputValues.orderItemId}
                  className="test-button"
                >
                  {loading.getOrderItemById ? 'Testing...' : 'Get Order Item by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteOrderItemById', () => deleteOrderItemById(inputValues.orderItemId))}
                  disabled={loading.deleteOrderItemById || !inputValues.orderItemId}
                  className="test-button delete-button"
                >
                  {loading.deleteOrderItemById ? 'Deleting...' : 'Delete Order Item'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllOrderItems')}
            {renderTestResult('getOrderItemById')}
            {renderTestResult('deleteOrderItemById')}
          </div>

          {/* Person Service Tests */}
          <div className="service-section">
            <h3>Person Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllPersons', getAllPersons)}
                disabled={loading.getAllPersons}
                className="test-button"
              >
                {loading.getAllPersons ? 'Testing...' : 'Get All Persons'}
              </button>
              
              <div className="input-group">
                <select
                  value={inputValues.roleType}
                  onChange={(e) => updateInputValue('roleType', e.target.value)}
                  className="test-input"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="FISHER">FISHER</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
                <button 
                  onClick={() => testEndpoint('getPersonsByRoleType', () => getPersonsByRoleType(inputValues.roleType))}
                  disabled={loading.getPersonsByRoleType}
                  className="test-button"
                >
                  {loading.getPersonsByRoleType ? 'Testing...' : 'Get Persons by Role'}
                </button>
              </div>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Person ID"
                  value={inputValues.personId}
                  onChange={(e) => updateInputValue('personId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getPersonById', () => getPersonById(inputValues.personId))}
                  disabled={loading.getPersonById || !inputValues.personId}
                  className="test-button"
                >
                  {loading.getPersonById ? 'Testing...' : 'Get Person by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('getRoleTypeByPersonId', () => getRoleTypeByPersonId(inputValues.personId))}
                  disabled={loading.getRoleTypeByPersonId || !inputValues.personId}
                  className="test-button"
                >
                  {loading.getRoleTypeByPersonId ? 'Testing...' : 'Get Person Role'}
                </button>
                <button 
                  onClick={() => testEndpoint('deletePersonById', () => deletePersonById(inputValues.personId))}
                  disabled={loading.deletePersonById || !inputValues.personId}
                  className="test-button delete-button"
                >
                  {loading.deletePersonById ? 'Deleting...' : 'Delete Person'}
                </button>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={inputValues.username}
                  onChange={(e) => updateInputValue('username', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getPersonByUsername', () => getPersonByUsername(inputValues.username))}
                  disabled={loading.getPersonByUsername || !inputValues.username}
                  className="test-button"
                >
                  {loading.getPersonByUsername ? 'Testing...' : 'Get Person by Username'}
                </button>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Login Username"
                  value={inputValues.credentials.username}
                  onChange={(e) => updateInputValue('credentials.username', e.target.value)}
                  className="test-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={inputValues.credentials.password}
                  onChange={(e) => updateInputValue('credentials.password', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('loginPerson', () => loginPerson(inputValues.credentials))}
                  disabled={loading.loginPerson || !inputValues.credentials.username || !inputValues.credentials.password}
                  className="test-button login-button"
                >
                  {loading.loginPerson ? 'Logging in...' : 'Login Person'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllPersons')}
            {renderTestResult('getPersonsByRoleType')}
            {renderTestResult('getPersonById')}
            {renderTestResult('getRoleTypeByPersonId')}
            {renderTestResult('deletePersonById')}
            {renderTestResult('getPersonByUsername')}
            {renderTestResult('loginPerson')}
          </div>

          {/* User Role Service Tests */}
          <div className="service-section">
            <h3>User Role Service</h3>
            <div className="test-buttons">
              <button 
                onClick={() => testEndpoint('getAllUserRoles', getAllUserRoles)}
                disabled={loading.getAllUserRoles}
                className="test-button"
              >
                {loading.getAllUserRoles ? 'Testing...' : 'Get All User Roles'}
              </button>
              
              <div className="input-group">
                <input
                  type="number"
                  placeholder="User Role ID"
                  value={inputValues.userRoleId}
                  onChange={(e) => updateInputValue('userRoleId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('getUserRoleById', () => getUserRoleById(inputValues.userRoleId))}
                  disabled={loading.getUserRoleById || !inputValues.userRoleId}
                  className="test-button"
                >
                  {loading.getUserRoleById ? 'Testing...' : 'Get User Role by ID'}
                </button>
                <button 
                  onClick={() => testEndpoint('deleteUserRoleById', () => deleteUserRoleById(inputValues.userRoleId))}
                  disabled={loading.deleteUserRoleById || !inputValues.userRoleId}
                  className="test-button delete-button"
                >
                  {loading.deleteUserRoleById ? 'Deleting...' : 'Delete User Role'}
                </button>
              </div>
              
              <div className="input-group">
                <select
                  value={inputValues.userRoleType}
                  onChange={(e) => updateInputValue('userRoleType', e.target.value)}
                  className="test-input"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="FISHER">FISHER</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
                <button 
                  onClick={() => testEndpoint('getUserRoleByType', () => getUserRoleByType(inputValues.userRoleType))}
                  disabled={loading.getUserRoleByType}
                  className="test-button"
                >
                  {loading.getUserRoleByType ? 'Testing...' : 'Get User Role by Type'}
                </button>
              </div>
            </div>
            
            {renderTestResult('getAllUserRoles')}
            {renderTestResult('getUserRoleById')}
            {renderTestResult('deleteUserRoleById')}
            {renderTestResult('getUserRoleByType')}
          </div>

          {/* CREATE Operations (POST) */}
          <div className="service-section">
            <h3>Create Operations (POST)</h3>
            
            <div className="create-form">
              <h4>Create New Catch</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Species ID"
                  value={inputValues.newCatch.speciesId}
                  onChange={(e) => updateInputValue('newCatch.speciesId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Fisher ID"
                  value={inputValues.newCatch.fisherId}
                  onChange={(e) => updateInputValue('newCatch.fisherId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Landing ID"
                  value={inputValues.newCatch.landingId}
                  onChange={(e) => updateInputValue('newCatch.landingId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={inputValues.newCatch.quantity}
                  onChange={(e) => updateInputValue('newCatch.quantity', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price Per Kg"
                  value={inputValues.newCatch.pricePerKg}
                  onChange={(e) => updateInputValue('newCatch.pricePerKg', e.target.value)}
                  className="test-input"
                />
                <input
                  type="date"
                  placeholder="Date Caught"
                  value={inputValues.newCatch.dateCaught}
                  onChange={(e) => updateInputValue('newCatch.dateCaught', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createCatch', () => createCatch(inputValues.newCatch))}
                  disabled={loading.createCatch || !inputValues.newCatch.speciesId || !inputValues.newCatch.fisherId}
                  className="test-button create-button"
                >
                  {loading.createCatch ? 'Creating...' : 'Create Catch'}
                </button>
              </div>
              {renderTestResult('createCatch')}
            </div>
            
            <div className="create-form">
              <h4>Create New Species</h4>
              <div className="form-inputs">
                <input
                  type="text"
                  placeholder="Species Name"
                  value={inputValues.newSpecies.name}
                  onChange={(e) => updateInputValue('newSpecies.name', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={inputValues.newSpecies.description}
                  onChange={(e) => updateInputValue('newSpecies.description', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createSpecies', () => createSpecies(inputValues.newSpecies))}
                  disabled={loading.createSpecies || !inputValues.newSpecies.name}
                  className="test-button create-button"
                >
                  {loading.createSpecies ? 'Creating...' : 'Create Species'}
                </button>
              </div>
              {renderTestResult('createSpecies')}
            </div>

            <div className="create-form">
              <h4>Create New Fisher</h4>
              <div className="form-inputs">
                <input
                  type="text"
                  placeholder="First Name"
                  value={inputValues.newFisher.firstName}
                  onChange={(e) => updateInputValue('newFisher.firstName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={inputValues.newFisher.lastName}
                  onChange={(e) => updateInputValue('newFisher.lastName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={inputValues.newFisher.email}
                  onChange={(e) => updateInputValue('newFisher.email', e.target.value)}
                  className="test-input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={inputValues.newFisher.phoneNumber}
                  onChange={(e) => updateInputValue('newFisher.phoneNumber', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createFisher', () => createFisher(inputValues.newFisher))}
                  disabled={loading.createFisher || !inputValues.newFisher.firstName || !inputValues.newFisher.lastName}
                  className="test-button create-button"
                >
                  {loading.createFisher ? 'Creating...' : 'Create Fisher'}
                </button>
              </div>
              {renderTestResult('createFisher')}
            </div>
            
            <div className="create-form">
              <h4>Create New Landing</h4>
              <div className="form-inputs">
                <input
                  type="text"
                  placeholder="Landing Name"
                  value={inputValues.newLanding.name}
                  onChange={(e) => updateInputValue('newLanding.name', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={inputValues.newLanding.location}
                  onChange={(e) => updateInputValue('newLanding.location', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={inputValues.newLanding.description}
                  onChange={(e) => updateInputValue('newLanding.description', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createLanding', () => createLanding(inputValues.newLanding))}
                  disabled={loading.createLanding || !inputValues.newLanding.name}
                  className="test-button create-button"
                >
                  {loading.createLanding ? 'Creating...' : 'Create Landing'}
                </button>
              </div>
              {renderTestResult('createLanding')}
            </div>
            
            <div className="create-form">
              <h4>Create New Order</h4>
              <div className="form-inputs">
                <input
                  type="text"
                  placeholder="Customer Username"
                  value={inputValues.newOrder.customerUsername}
                  onChange={(e) => updateInputValue('newOrder.customerUsername', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Total Amount"
                  value={inputValues.newOrder.totalAmount}
                  onChange={(e) => updateInputValue('newOrder.totalAmount', e.target.value)}
                  className="test-input"
                />
                <input
                  type="date"
                  placeholder="Order Date"
                  value={inputValues.newOrder.orderDate}
                  onChange={(e) => updateInputValue('newOrder.orderDate', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createOrder', () => createOrder(inputValues.newOrder))}
                  disabled={loading.createOrder || !inputValues.newOrder.customerUsername}
                  className="test-button create-button"
                >
                  {loading.createOrder ? 'Creating...' : 'Create Order'}
                </button>
              </div>
              {renderTestResult('createOrder')}
            </div>
            
            <div className="create-form">
              <h4>Create New Order Item</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Order ID"
                  value={inputValues.newOrderItem.orderId}
                  onChange={(e) => updateInputValue('newOrderItem.orderId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Catch ID"
                  value={inputValues.newOrderItem.catchId}
                  onChange={(e) => updateInputValue('newOrderItem.catchId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={inputValues.newOrderItem.quantity}
                  onChange={(e) => updateInputValue('newOrderItem.quantity', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price Per Kg"
                  value={inputValues.newOrderItem.pricePerKg}
                  onChange={(e) => updateInputValue('newOrderItem.pricePerKg', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createOrderItem', () => createOrderItem(inputValues.newOrderItem))}
                  disabled={loading.createOrderItem || !inputValues.newOrderItem.orderId || !inputValues.newOrderItem.catchId}
                  className="test-button create-button"
                >
                  {loading.createOrderItem ? 'Creating...' : 'Create Order Item'}
                </button>
              </div>
              {renderTestResult('createOrderItem')}
            </div>
            
            <div className="create-form">
              <h4>Create New Person</h4>
              <div className="form-inputs">
                <input
                  type="text"
                  placeholder="Username"
                  value={inputValues.newPerson.username}
                  onChange={(e) => updateInputValue('newPerson.username', e.target.value)}
                  className="test-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={inputValues.newPerson.password}
                  onChange={(e) => updateInputValue('newPerson.password', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={inputValues.newPerson.firstName}
                  onChange={(e) => updateInputValue('newPerson.firstName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={inputValues.newPerson.lastName}
                  onChange={(e) => updateInputValue('newPerson.lastName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={inputValues.newPerson.email}
                  onChange={(e) => updateInputValue('newPerson.email', e.target.value)}
                  className="test-input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={inputValues.newPerson.phoneNumber}
                  onChange={(e) => updateInputValue('newPerson.phoneNumber', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="User Role ID"
                  value={inputValues.newPerson.userRoleId}
                  onChange={(e) => updateInputValue('newPerson.userRoleId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createPerson', () => createPerson(inputValues.newPerson))}
                  disabled={loading.createPerson || !inputValues.newPerson.username || !inputValues.newPerson.firstName}
                  className="test-button create-button"
                >
                  {loading.createPerson ? 'Creating...' : 'Create Person'}
                </button>
              </div>
              {renderTestResult('createPerson')}
            </div>
            
            <div className="create-form">
              <h4>Create New User Role</h4>
              <div className="form-inputs">
                <select
                  value={inputValues.newUserRole.roleType}
                  onChange={(e) => updateInputValue('newUserRole.roleType', e.target.value)}
                  className="test-input"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="FISHER">FISHER</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={inputValues.newUserRole.description}
                  onChange={(e) => updateInputValue('newUserRole.description', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('createUserRole', () => createUserRole(inputValues.newUserRole))}
                  disabled={loading.createUserRole || !inputValues.newUserRole.roleType}
                  className="test-button create-button"
                >
                  {loading.createUserRole ? 'Creating...' : 'Create User Role'}
                </button>
              </div>
              {renderTestResult('createUserRole')}
            </div>
          </div>

          {/* UPDATE Operations (PUT) */}
          <div className="service-section">
            <h3>Update Operations (PUT)</h3>
            
            <div className="create-form">
              <h4>Update Catch</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Catch ID to Update"
                  value={inputValues.catchId}
                  onChange={(e) => updateInputValue('catchId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Species ID"
                  value={inputValues.updateCatch.speciesId}
                  onChange={(e) => updateInputValue('updateCatch.speciesId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Fisher ID"
                  value={inputValues.updateCatch.fisherId}
                  onChange={(e) => updateInputValue('updateCatch.fisherId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Landing ID"
                  value={inputValues.updateCatch.landingId}
                  onChange={(e) => updateInputValue('updateCatch.landingId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={inputValues.updateCatch.quantity}
                  onChange={(e) => updateInputValue('updateCatch.quantity', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price Per Kg"
                  value={inputValues.updateCatch.pricePerKg}
                  onChange={(e) => updateInputValue('updateCatch.pricePerKg', e.target.value)}
                  className="test-input"
                />
                <input
                  type="date"
                  placeholder="Date Caught"
                  value={inputValues.updateCatch.dateCaught}
                  onChange={(e) => updateInputValue('updateCatch.dateCaught', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateCatch', () => updateCatch(inputValues.catchId, inputValues.updateCatch))}
                  disabled={loading.updateCatch || !inputValues.catchId}
                  className="test-button update-button"
                >
                  {loading.updateCatch ? 'Updating...' : 'Update Catch'}
                </button>
              </div>
              {renderTestResult('updateCatch')}
            </div>
            
            <div className="create-form">
              <h4>Update Fisher</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Fisher ID to Update"
                  value={inputValues.fisherId}
                  onChange={(e) => updateInputValue('fisherId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={inputValues.updateFisher.firstName}
                  onChange={(e) => updateInputValue('updateFisher.firstName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={inputValues.updateFisher.lastName}
                  onChange={(e) => updateInputValue('updateFisher.lastName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={inputValues.updateFisher.email}
                  onChange={(e) => updateInputValue('updateFisher.email', e.target.value)}
                  className="test-input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={inputValues.updateFisher.phoneNumber}
                  onChange={(e) => updateInputValue('updateFisher.phoneNumber', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateFisher', () => updateFisher(inputValues.fisherId, inputValues.updateFisher))}
                  disabled={loading.updateFisher || !inputValues.fisherId}
                  className="test-button update-button"
                >
                  {loading.updateFisher ? 'Updating...' : 'Update Fisher'}
                </button>
              </div>
              {renderTestResult('updateFisher')}
            </div>
            
            <div className="create-form">
              <h4>Update Species</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Species ID to Update"
                  value={inputValues.speciesId}
                  onChange={(e) => updateInputValue('speciesId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Species Name"
                  value={inputValues.updateSpecies.name}
                  onChange={(e) => updateInputValue('updateSpecies.name', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={inputValues.updateSpecies.description}
                  onChange={(e) => updateInputValue('updateSpecies.description', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateSpecies', () => updateSpecies(inputValues.speciesId, inputValues.updateSpecies))}
                  disabled={loading.updateSpecies || !inputValues.speciesId}
                  className="test-button update-button"
                >
                  {loading.updateSpecies ? 'Updating...' : 'Update Species'}
                </button>
              </div>
              {renderTestResult('updateSpecies')}
            </div>
            
            <div className="create-form">
              <h4>Update Landing</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Landing ID to Update"
                  value={inputValues.landingId}
                  onChange={(e) => updateInputValue('landingId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Landing Name"
                  value={inputValues.updateLanding.name}
                  onChange={(e) => updateInputValue('updateLanding.name', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={inputValues.updateLanding.location}
                  onChange={(e) => updateInputValue('updateLanding.location', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={inputValues.updateLanding.description}
                  onChange={(e) => updateInputValue('updateLanding.description', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateLanding', () => updateLanding(inputValues.landingId, inputValues.updateLanding))}
                  disabled={loading.updateLanding || !inputValues.landingId}
                  className="test-button update-button"
                >
                  {loading.updateLanding ? 'Updating...' : 'Update Landing'}
                </button>
              </div>
              {renderTestResult('updateLanding')}
            </div>
            
            <div className="create-form">
              <h4>Update Order</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Order ID to Update"
                  value={inputValues.orderId}
                  onChange={(e) => updateInputValue('orderId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Customer Username"
                  value={inputValues.updateOrder.customerUsername}
                  onChange={(e) => updateInputValue('updateOrder.customerUsername', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Total Amount"
                  value={inputValues.updateOrder.totalAmount}
                  onChange={(e) => updateInputValue('updateOrder.totalAmount', e.target.value)}
                  className="test-input"
                />
                <input
                  type="date"
                  placeholder="Order Date"
                  value={inputValues.updateOrder.orderDate}
                  onChange={(e) => updateInputValue('updateOrder.orderDate', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateOrder', () => updateOrder(inputValues.orderId, inputValues.updateOrder))}
                  disabled={loading.updateOrder || !inputValues.orderId}
                  className="test-button update-button"
                >
                  {loading.updateOrder ? 'Updating...' : 'Update Order'}
                </button>
              </div>
              {renderTestResult('updateOrder')}
            </div>
            
            <div className="create-form">
              <h4>Update Order Item</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Order Item ID to Update"
                  value={inputValues.orderItemId}
                  onChange={(e) => updateInputValue('orderItemId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Order ID"
                  value={inputValues.updateOrderItem.orderId}
                  onChange={(e) => updateInputValue('updateOrderItem.orderId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Catch ID"
                  value={inputValues.updateOrderItem.catchId}
                  onChange={(e) => updateInputValue('updateOrderItem.catchId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={inputValues.updateOrderItem.quantity}
                  onChange={(e) => updateInputValue('updateOrderItem.quantity', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price Per Kg"
                  value={inputValues.updateOrderItem.pricePerKg}
                  onChange={(e) => updateInputValue('updateOrderItem.pricePerKg', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateOrderItem', () => updateOrderItem(inputValues.orderItemId, inputValues.updateOrderItem))}
                  disabled={loading.updateOrderItem || !inputValues.orderItemId}
                  className="test-button update-button"
                >
                  {loading.updateOrderItem ? 'Updating...' : 'Update Order Item'}
                </button>
              </div>
              {renderTestResult('updateOrderItem')}
            </div>
            
            <div className="create-form">
              <h4>Update Person</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="Person ID to Update"
                  value={inputValues.personId}
                  onChange={(e) => updateInputValue('personId', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={inputValues.updatePerson.username}
                  onChange={(e) => updateInputValue('updatePerson.username', e.target.value)}
                  className="test-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={inputValues.updatePerson.password}
                  onChange={(e) => updateInputValue('updatePerson.password', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={inputValues.updatePerson.firstName}
                  onChange={(e) => updateInputValue('updatePerson.firstName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={inputValues.updatePerson.lastName}
                  onChange={(e) => updateInputValue('updatePerson.lastName', e.target.value)}
                  className="test-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={inputValues.updatePerson.email}
                  onChange={(e) => updateInputValue('updatePerson.email', e.target.value)}
                  className="test-input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={inputValues.updatePerson.phoneNumber}
                  onChange={(e) => updateInputValue('updatePerson.phoneNumber', e.target.value)}
                  className="test-input"
                />
                <input
                  type="number"
                  placeholder="User Role ID"
                  value={inputValues.updatePerson.userRoleId}
                  onChange={(e) => updateInputValue('updatePerson.userRoleId', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updatePerson', () => updatePerson(inputValues.personId, inputValues.updatePerson))}
                  disabled={loading.updatePerson || !inputValues.personId}
                  className="test-button update-button"
                >
                  {loading.updatePerson ? 'Updating...' : 'Update Person'}
                </button>
              </div>
              {renderTestResult('updatePerson')}
            </div>
            
            <div className="create-form">
              <h4>Update User Role</h4>
              <div className="form-inputs">
                <input
                  type="number"
                  placeholder="User Role ID to Update"
                  value={inputValues.userRoleId}
                  onChange={(e) => updateInputValue('userRoleId', e.target.value)}
                  className="test-input"
                />
                <select
                  value={inputValues.updateUserRole.roleType}
                  onChange={(e) => updateInputValue('updateUserRole.roleType', e.target.value)}
                  className="test-input"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="FISHER">FISHER</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={inputValues.updateUserRole.description}
                  onChange={(e) => updateInputValue('updateUserRole.description', e.target.value)}
                  className="test-input"
                />
                <button 
                  onClick={() => testEndpoint('updateUserRole', () => updateUserRole(inputValues.userRoleId, inputValues.updateUserRole))}
                  disabled={loading.updateUserRole || !inputValues.userRoleId}
                  className="test-button update-button"
                >
                  {loading.updateUserRole ? 'Updating...' : 'Update User Role'}
                </button>
              </div>
              {renderTestResult('updateUserRole')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTest;
