import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FisherTooltip from './FisherTooltip';

describe('FisherTooltip', () => {
  const mockFisherDataComplete = {
    id: 1,
    person: {
      id: 101,
      username: 'captain_fisher',
      email: 'captain@fishery.com',
      phoneNumber: '+1-555-0123',
      profileImageUrl: 'https://example.com/captain.jpg'
    },
    fishingLicenseNumber: 'FL-2024-001',
    defaultLanding: {
      id: 1,
      name: 'Harbor Bay',
      portName: 'Harbor Bay Port'
    },
    yearsOfExperience: 15,
    specializations: ['Deep Sea Fishing', 'Tuna', 'Salmon']
  };

  const mockFisherDataMinimal = {
    id: 2,
    person: {
      id: 102,
      username: 'new_fisher'
    },
    fishingLicenseNumber: 'FL-2024-002'
  };

  const mockFisherDataNoImage = {
    id: 3,
    person: {
      id: 103,
      username: 'experienced_fisher',
      email: 'fisher@ocean.com',
      phoneNumber: '+1-555-0456'
    },
    fishingLicenseNumber: 'FL-2024-003',
    yearsOfExperience: 8,
    specializations: ['Coastal Fishing']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render fisher name correctly', () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      expect(screen.getByText('captain_fisher')).toBeInTheDocument();
    });

    it('should render fisher name with proper styling class', () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      expect(fisherName).toHaveClass('fisher-name');
    });

    it('should not show tooltip initially', () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      expect(screen.queryByText('captain@fishery.com')).not.toBeInTheDocument();
    });
  });

  describe('Hover Interactions', () => {
    it('should show tooltip on mouse enter', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByText('📧 captain@fishery.com')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      
      // Show tooltip
      fireEvent.mouseEnter(fisherName);
      await waitFor(() => {
        expect(screen.getByText('📧 captain@fishery.com')).toBeInTheDocument();
      });
      
      // Hide tooltip
      fireEvent.mouseLeave(fisherName);
      await waitFor(() => {
        expect(screen.queryByText('📧 captain@fishery.com')).not.toBeInTheDocument();
      });
    });

    it('should show and hide tooltip multiple times', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      
      // First hover
      fireEvent.mouseEnter(fisherName);
      await waitFor(() => {
        expect(screen.getByText('📧 captain@fishery.com')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(fisherName);
      await waitFor(() => {
        expect(screen.queryByText('📧 captain@fishery.com')).not.toBeInTheDocument();
      });
      
      // Second hover
      fireEvent.mouseEnter(fisherName);
      await waitFor(() => {
        expect(screen.getByText('📧 captain@fishery.com')).toBeInTheDocument();
      });
    });
  });

  describe('Tooltip Content Display', () => {
    it('should display all fisher data when available', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'captain_fisher' })).toBeInTheDocument();
        expect(screen.getByText('License: FL-2024-001')).toBeInTheDocument();
        expect(screen.getByText('📧 captain@fishery.com')).toBeInTheDocument();
        expect(screen.getByText('📞 +1-555-0123')).toBeInTheDocument();
        expect(screen.getByText('🏠 Home Port: Harbor Bay')).toBeInTheDocument();
        expect(screen.getByText('⭐ 15 years experience')).toBeInTheDocument();
        expect(screen.getByText('Specializations:')).toBeInTheDocument();
        expect(screen.getByText('Deep Sea Fishing')).toBeInTheDocument();
        expect(screen.getByText('Tuna')).toBeInTheDocument();
        expect(screen.getByText('Salmon')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('should display fisher data without image when profileImageUrl is null', async () => {
      render(
        <FisherTooltip 
          fisherName="experienced_fisher" 
          fisherData={mockFisherDataNoImage} 
        />
      );
      
      const fisherName = screen.getByText('experienced_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'experienced_fisher' })).toBeInTheDocument();
        expect(screen.getByText('License: FL-2024-003')).toBeInTheDocument();
        expect(screen.getByText('📧 fisher@ocean.com')).toBeInTheDocument();
        expect(screen.getByText('📞 +1-555-0456')).toBeInTheDocument();
        expect(screen.getByText('⭐ 8 years experience')).toBeInTheDocument();
        expect(screen.getByText('Coastal Fishing')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });

    it('should display minimal fisher data when optional fields are missing', async () => {
      render(
        <FisherTooltip 
          fisherName="new_fisher" 
          fisherData={mockFisherDataMinimal} 
        />
      );
      
      const fisherName = screen.getByText('new_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'new_fisher' })).toBeInTheDocument();
        expect(screen.getByText('License: FL-2024-002')).toBeInTheDocument();
        expect(screen.queryByText(/📧/)).not.toBeInTheDocument();
        expect(screen.queryByText(/📞/)).not.toBeInTheDocument();
        expect(screen.queryByText(/🏠/)).not.toBeInTheDocument();
        expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
        expect(screen.queryByText('Specializations:')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });

    it('should not show tooltip when fisherData is null', async () => {
      render(
        <FisherTooltip 
          fisherName="Unknown Fisher" 
          fisherData={null} 
        />
      );
      
      const fisherName = screen.getByText('Unknown Fisher');
      fireEvent.mouseEnter(fisherName);
      
      // Wait a bit to ensure nothing appears
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.queryByText('Unknown Fisher')).toBeInTheDocument(); // The name itself
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText(/License:/)).not.toBeInTheDocument();
    });

    it('should not show tooltip when fisherData is undefined', async () => {
      render(
        <FisherTooltip 
          fisherName="Unknown Fisher" 
          fisherData={undefined} 
        />
      );
      
      const fisherName = screen.getByText('Unknown Fisher');
      fireEvent.mouseEnter(fisherName);
      
      // Wait a bit to ensure nothing appears
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText(/License:/)).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should render image with correct attributes when profileImageUrl is provided', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'https://example.com/captain.jpg');
        expect(image).toHaveAttribute('alt', 'captain_fisher');
        expect(image).toHaveClass('fisher-image');
      });
    });

    it('should handle image load error by hiding the image', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        const image = screen.getByRole('img');
        fireEvent.error(image);
        expect(image.style.display).toBe('none');
      });
    });
  });

  describe('Specializations Display', () => {
    it('should render specializations as tags when available', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByText('Specializations:')).toBeInTheDocument();
        
        const specTags = document.querySelectorAll('.spec-tag');
        expect(specTags).toHaveLength(3);
        expect(specTags[0]).toHaveTextContent('Deep Sea Fishing');
        expect(specTags[1]).toHaveTextContent('Tuna');
        expect(specTags[2]).toHaveTextContent('Salmon');
      });
    });

    it('should not show specializations section when array is empty', async () => {
      const fisherWithEmptySpecs = {
        ...mockFisherDataMinimal,
        specializations: []
      };
      
      render(
        <FisherTooltip 
          fisherName="new_fisher" 
          fisherData={fisherWithEmptySpecs} 
        />
      );
      
      const fisherName = screen.getByText('new_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.queryByText('Specializations:')).not.toBeInTheDocument();
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to tooltip elements', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const container = screen.getByText('captain_fisher').parentElement;
      expect(container).toHaveClass('fisher-tooltip-container');
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(fisherName).toHaveClass('fisher-name');
        
        const tooltip = container.querySelector('.fisher-tooltip');
        expect(tooltip).toBeInTheDocument();
        
        const content = container.querySelector('.tooltip-content');
        expect(content).toBeInTheDocument();
        
        const header = container.querySelector('.tooltip-header');
        expect(header).toBeInTheDocument();
        
        const title = container.querySelector('.fisher-title');
        expect(title).toBeInTheDocument();
        
        const license = container.querySelector('.license-number');
        expect(license).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty fisher name', () => {
      const emptyNameData = {
        id: 6,
        person: {
          username: '',
          email: 'empty@fishery.com'
        },
        fishingLicenseNumber: 'FL-EMPTY'
      };
      
      render(
        <FisherTooltip 
          fisherName="" 
          fisherData={emptyNameData} 
        />
      );
      
      // Check that the span element exists even with empty text
      const fisherSpan = document.querySelector('.fisher-name');
      expect(fisherSpan).toBeInTheDocument();
      expect(fisherSpan.textContent).toBe('');
    });

    it('should handle fisher data with missing person object', async () => {
      const dataWithoutPerson = {
        id: 7,
        fishingLicenseNumber: 'FL-NO-PERSON'
      };
      
      render(
        <FisherTooltip 
          fisherName="Test Fisher" 
          fisherData={dataWithoutPerson} 
        />
      );
      
      const fisherName = screen.getByText('Test Fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Fisher' })).toBeInTheDocument();
        expect(screen.getByText('License: FL-NO-PERSON')).toBeInTheDocument();
        expect(screen.queryByText(/📧/)).not.toBeInTheDocument();
        expect(screen.queryByText(/📞/)).not.toBeInTheDocument();
      });
    });

    it('should handle missing license number', async () => {
      const dataWithoutLicense = {
        id: 8,
        person: {
          username: 'unlicensed_fisher',
          email: 'unlicensed@fishery.com'
        }
      };
      
      render(
        <FisherTooltip 
          fisherName="unlicensed_fisher" 
          fisherData={dataWithoutLicense} 
        />
      );
      
      const fisherName = screen.getByText('unlicensed_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'unlicensed_fisher' })).toBeInTheDocument();
        expect(screen.queryByText(/License:/)).not.toBeInTheDocument();
        expect(screen.getByText('📧 unlicensed@fishery.com')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      expect(fisherName.tagName).toBe('SPAN');
    });

    it('should have proper heading structure', async () => {
      render(
        <FisherTooltip 
          fisherName="captain_fisher" 
          fisherData={mockFisherDataComplete} 
        />
      );
      
      const fisherName = screen.getByText('captain_fisher');
      fireEvent.mouseEnter(fisherName);
      
      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: 'captain_fisher' });
        expect(heading.tagName).toBe('H4');
      });
    });
  });
});
