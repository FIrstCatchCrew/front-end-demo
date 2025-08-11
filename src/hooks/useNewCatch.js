import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCatch } from '../services/CatchService';
import { getAllSpecies } from '../services/SpeciesService';
import { getAllLandings } from '../services/LandingService';
import { getAllFishers } from '../services/FisherService';

export function useNewCatch() {
  const [formData, setFormData] = useState({
    speciesId: '',
    fisherId: '',
    landingId: '',
    quantityInKg: '',
    pricePerKg: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    species: [],
    fishers: [],
    landings: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      setIsLoading(true);
      try {
        const [speciesData, fishersData, landingsData] = await Promise.all([
          getAllSpecies(),
          getAllFishers(),
          getAllLandings(),
        ]);
        
        setDropdownOptions({
          species: speciesData,
          fishers: fishersData,
          landings: landingsData,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownOptions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.speciesId) {
      errors.speciesId = 'Species is required';
    }

    if (!formData.fisherId) {
      errors.fisherId = 'Fisher is required';
    }

    if (!formData.landingId) {
      errors.landingId = 'Landing port is required';
    }

    if (!formData.quantityInKg) {
      errors.quantityInKg = 'Quantity is required';
    } else if (parseFloat(formData.quantityInKg) <= 0) {
      errors.quantityInKg = 'Quantity must be greater than 0';
    }

    if (!formData.pricePerKg) {
      errors.pricePerKg = 'Price per kg is required';
    } else if (parseFloat(formData.pricePerKg) <= 0) {
      errors.pricePerKg = 'Price must be greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the data for API submission
      const catchData = {
        species: { id: parseInt(formData.speciesId) },
        fisher: { id: parseInt(formData.fisherId) },
        landing: { id: parseInt(formData.landingId) },
        quantityInKg: parseFloat(formData.quantityInKg),
        pricePerKg: parseFloat(formData.pricePerKg),
      };

      const result = await createCatch(catchData);
      
      // Reset form on success
      setFormData({
        speciesId: '',
        fisherId: '',
        landingId: '',
        quantityInKg: '',
        pricePerKg: '',
      });

      // Navigate to available catches page to see the new catch
      navigate('/available-catches');
      
      return result;
    } catch (err) {
      console.error("Error creating catch:", err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      speciesId: '',
      fisherId: '',
      landingId: '',
      quantityInKg: '',
      pricePerKg: '',
    });
    setValidationErrors({});
    setError(null);
  };

  return {
    formData,
    dropdownOptions,
    isLoading,
    isSubmitting,
    error,
    validationErrors,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
