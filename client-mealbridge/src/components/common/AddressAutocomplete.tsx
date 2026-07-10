import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Loader2, SearchX } from "lucide-react";
import { useAddressSuggestions } from "../../hooks/useAddressSuggestions";
import { useClickOutside } from "../../hooks/useClickOutside";
import type { AddressSuggestion } from "../../services/location.service";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  onAreaChange?: (area: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  countryCodes?: string;
  minLength?: number;
  limit?: number;
  debounceMs?: number;
  className?: string;
  id?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onAreaChange,
  label,
  placeholder = "Search for address...",
  error,
  helperText,
  required,
  disabled,
  countryCodes,
  minLength = 3,
  limit = 5,
  debounceMs = 400,
  className = "",
  id,
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading, error: fetchError } = useAddressSuggestions({
    query: value,
    debounceMs,
    minLength,
    limit,
    countryCodes,
    enabled: isOpen && !disabled,
  });

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleSelect = useCallback(
    (suggestion: AddressSuggestion) => {
      onChange(suggestion.fullAddress);
      onSelect(suggestion);
      if (suggestion.area && onAreaChange) {
        onAreaChange(suggestion.area);
      }
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    },
    [onChange, onSelect, onAreaChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && value.length >= minLength) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[activeIndex] as HTMLElement | undefined;
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const showDropdown = isOpen && value.length >= minLength;
  const inputId = id || "address-autocomplete";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-dark-gray">
          {label}
          {/* {required && <span className="ml-0.5 text-red-500">*</span>} */}
        </label>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
          <MapPin className="h-4 w-4" />
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={`${inputId}-listbox`}
          aria-expanded={showDropdown}
          aria-activedescendant={activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined}
          className={`focus-ring block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-dark-gray placeholder:text-text-muted ${
            error ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
          } ${disabled ? "cursor-not-allowed bg-warm-50 opacity-60" : ""}`}
        />
      </div>

      {showDropdown && (
        <ul
          ref={listboxRef}
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-72 w-full overflow-auto rounded-lg border border-border bg-white py-1 shadow-dropdown animate-fade-in"
        >
          {isLoading && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching addresses...
            </li>
          )}

          {!isLoading && fetchError && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-500">
              <SearchX className="h-4 w-4" />
              {fetchError}
            </li>
          )}

          {!isLoading && !fetchError && suggestions.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-text-muted">
              No addresses found
              {countryCodes && ` in ${countryCodes.toUpperCase()}`}
            </li>
          )}

          {!isLoading &&
            !fetchError &&
            suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`${inputId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(suggestion)}
                className={`cursor-pointer px-3 py-2.5 text-sm transition-colors ${
                  index === activeIndex ? "bg-primary-50 text-primary" : "text-dark-gray hover:bg-warm-50"
                }`}
              >
                <div className="font-medium">{suggestion.label}</div>
                <div className="truncate text-xs text-text-muted">{suggestion.fullAddress}</div>
              </li>
            ))}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-text-muted">{helperText}</p>}
    </div>
  );
}
