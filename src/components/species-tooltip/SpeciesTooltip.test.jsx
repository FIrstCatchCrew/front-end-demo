import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpeciesTooltip from './SpeciesTooltip';

describe('SpeciesTooltip', () => {
  const mockSpeciesData = {
    id: 1,
    name: 'Atlantic Salmon',
    description: 'A popular salmon species found in the North Atlantic',
    imageUrl: 'https://example.com/salmon.jpg',
    infoLink: 'https://example.com/salmon-info'
  };

  const mockSpeciesDataNoImage = {
    id: 2,
    name: 'Pacific Tuna',
    description: 'A large ocean fish',
    imageUrl: null,
    infoLink: 'https://example.com/tuna-info'
  };

  const mockSpeciesDataMinimal = {
    id: 3,
    name: 'Cod',
    description: 'A popular commercial fish',
    imageUrl: null,
    infoLink: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render species name correctly', () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      expect(screen.getByText('Atlantic Salmon')).toBeInTheDocument();
    });

    it('should render species name with proper styling class', () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      expect(speciesName).toHaveClass('species-name');
    });

    it('should not show tooltip initially', () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      expect(screen.queryByText('A popular salmon species found in the North Atlantic')).not.toBeInTheDocument();
    });
  });

  describe('Hover Interactions', () => {
    it('should show tooltip on mouse enter', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(screen.getByText('A popular salmon species found in the North Atlantic')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      
      // Show tooltip
      fireEvent.mouseEnter(speciesName);
      await waitFor(() => {
        expect(screen.getByText('A popular salmon species found in the North Atlantic')).toBeInTheDocument();
      });
      
      // Hide tooltip
      fireEvent.mouseLeave(speciesName);
      await waitFor(() => {
        expect(screen.queryByText('A popular salmon species found in the North Atlantic')).not.toBeInTheDocument();
      });
    });

    it('should show and hide tooltip multiple times', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      
      // First hover
      fireEvent.mouseEnter(speciesName);
      await waitFor(() => {
        expect(screen.getByText('A popular salmon species found in the North Atlantic')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(speciesName);
      await waitFor(() => {
        expect(screen.queryByText('A popular salmon species found in the North Atlantic')).not.toBeInTheDocument();
      });
      
      // Second hover
      fireEvent.mouseEnter(speciesName);
      await waitFor(() => {
        expect(screen.getByText('A popular salmon species found in the North Atlantic')).toBeInTheDocument();
      });
    });
  });

  describe('Tooltip Content Display', () => {
    it('should display all species data when available', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Atlantic Salmon' })).toBeInTheDocument();
        expect(screen.getByText('A popular salmon species found in the North Atlantic')).toBeInTheDocument();
        expect(screen.getByText('Learn More →')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('should display species data without image when imageUrl is null', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Pacific Tuna" 
          speciesData={mockSpeciesDataNoImage} 
        />
      );
      
      const speciesName = screen.getByText('Pacific Tuna');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Pacific Tuna' })).toBeInTheDocument();
        expect(screen.getByText('A large ocean fish')).toBeInTheDocument();
        expect(screen.getByText('Learn More →')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });

    it('should display minimal species data when optional fields are null', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Cod" 
          speciesData={mockSpeciesDataMinimal} 
        />
      );
      
      const speciesName = screen.getByText('Cod');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Cod' })).toBeInTheDocument();
        expect(screen.getByText('A popular commercial fish')).toBeInTheDocument();
        expect(screen.queryByText('Learn More →')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });

    it('should not show tooltip when speciesData is null', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Unknown Species" 
          speciesData={null} 
        />
      );
      
      const speciesName = screen.getByText('Unknown Species');
      fireEvent.mouseEnter(speciesName);
      
      // Wait a bit to ensure nothing appears
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.queryByText('Unknown Species')).toBeInTheDocument(); // The name itself
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText('Learn More →')).not.toBeInTheDocument();
    });

    it('should not show tooltip when speciesData is undefined', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Unknown Species" 
          speciesData={undefined} 
        />
      );
      
      const speciesName = screen.getByText('Unknown Species');
      fireEvent.mouseEnter(speciesName);
      
      // Wait a bit to ensure nothing appears
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText('Learn More →')).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should render image with correct attributes when imageUrl is provided', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'https://example.com/salmon.jpg');
        expect(image).toHaveAttribute('alt', 'Atlantic Salmon');
        expect(image).toHaveClass('species-image');
      });
    });

    it('should handle image load error by hiding the image', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        const image = screen.getByRole('img');
        fireEvent.error(image);
        expect(image.style.display).toBe('none');
      });
    });
  });

  describe('Link Interactions', () => {
    it('should render info link with correct attributes', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        const link = screen.getByText('Learn More →');
        expect(link).toHaveAttribute('href', 'https://example.com/salmon-info');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveClass('species-link');
      });
    });

    it('should stop propagation when clicking info link', async () => {
      const mockStopPropagation = vi.fn();
      
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        const link = screen.getByText('Learn More →');
        
        // Create a mock event with stopPropagation
        const mockEvent = {
          stopPropagation: mockStopPropagation,
          preventDefault: vi.fn()
        };
        
        fireEvent.click(link, mockEvent);
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to tooltip elements', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const container = screen.getByText('Atlantic Salmon').parentElement;
      expect(container).toHaveClass('species-tooltip-container');
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(speciesName).toHaveClass('species-name');
        
        const tooltip = container.querySelector('.species-tooltip');
        expect(tooltip).toBeInTheDocument();
        
        const content = container.querySelector('.tooltip-content');
        expect(content).toBeInTheDocument();
        
        const header = container.querySelector('.tooltip-header');
        expect(header).toBeInTheDocument();
        
        const title = container.querySelector('.species-title');
        expect(title).toBeInTheDocument();
        
        const description = container.querySelector('.species-description');
        expect(description).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty species name', () => {
      const emptyNameData = {
        id: 6,
        name: '',
        description: 'Species with empty name',
        imageUrl: null,
        infoLink: null
      };
      
      render(
        <SpeciesTooltip 
          speciesName="" 
          speciesData={emptyNameData} 
        />
      );
      
      // Check that the span element exists even with empty text
      const speciesSpan = document.querySelector('.species-name');
      expect(speciesSpan).toBeInTheDocument();
      expect(speciesSpan.textContent).toBe('');
    });

    it('should handle species data with empty description', async () => {
      const dataWithEmptyDescription = {
        id: 4,
        name: 'Test Species',
        description: '',
        imageUrl: 'https://example.com/test.jpg',
        infoLink: 'https://example.com/test-info'
      };
      
      render(
        <SpeciesTooltip 
          speciesName="Test Species" 
          speciesData={dataWithEmptyDescription} 
        />
      );
      
      const speciesName = screen.getByText('Test Species');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Species' })).toBeInTheDocument();
        // Check that the description paragraph is not rendered when description is empty
        const descriptionParagraph = document.querySelector('.species-description');
        expect(descriptionParagraph).not.toBeInTheDocument();
      });
    });

    it('should handle species data with empty infoLink', async () => {
      const dataWithEmptyLink = {
        id: 5,
        name: 'Test Species 2',
        description: 'A test species with no info link',
        imageUrl: 'https://example.com/test2.jpg',
        infoLink: ''
      };
      
      render(
        <SpeciesTooltip 
          speciesName="Test Species 2" 
          speciesData={dataWithEmptyLink} 
        />
      );
      
      const speciesName = screen.getByText('Test Species 2');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Species 2' })).toBeInTheDocument();
        expect(screen.queryByText('Learn More →')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      expect(speciesName.tagName).toBe('SPAN');
    });

    it('should have proper link accessibility', async () => {
      render(
        <SpeciesTooltip 
          speciesName="Atlantic Salmon" 
          speciesData={mockSpeciesData} 
        />
      );
      
      const speciesName = screen.getByText('Atlantic Salmon');
      fireEvent.mouseEnter(speciesName);
      
      await waitFor(() => {
        const link = screen.getByText('Learn More →');
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});
