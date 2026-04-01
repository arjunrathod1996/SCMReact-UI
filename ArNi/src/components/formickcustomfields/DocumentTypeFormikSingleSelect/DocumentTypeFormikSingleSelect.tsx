import React, { useState, useEffect, useRef } from "react";

type DocumentTypeSingleSelectProps = {
    name: string;
    required?: boolean;
    label: string;
    placeholder?: string;
    display?: { col: number };
    options?: string[]; // List of options for selection
};

const DocumentTypeFormikSingleSelect: React.FC<DocumentTypeSingleSelectProps> = ({
    name,
    required,
    label,
    placeholder = "Select...",
    display = { col: 12 },
    options = ["Policy", "Report", "Contract", "Invoice", "Invoice1", "Invoice2", "Hello", "Bye"], // Sample options
}) => {
    const [search, setSearch] = useState(""); // Track the search input
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Array of selected options
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Dropdown visibility
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1); // Highlighted option in the dropdown
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter options based on the search term
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(search.toLowerCase()) // Show options that match the search term
    );

    console.log("Filtered Options: ", filteredOptions); // Debugging: Log filtered options

    // Handle click outside the component to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
                setSearch(""); // Clear the search term when clicking outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle the selection of an option
    const toggleOption = (option: string) => {
        setSelectedOptions(prev => {
            if (prev.includes(option)) {
                return prev.filter(item => item !== option); // Remove option if already selected
            } else {
                return [...prev, option]; // Add option if not selected
            }
        });
    };

    // Handle keyboard navigation (up/down arrow keys)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            if (highlightedIndex >= 0) {
                toggleOption(filteredOptions[highlightedIndex]);
                setIsDropdownVisible(false);
            }
        }
    };

    // Handle input change to update the search term
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setIsDropdownVisible(true); // Show the dropdown when user types
    };

    // Add conditional classes for vertical dropdown when options exceed 5
    const dropdownClasses = filteredOptions.length > 5
        ? "absolute top-full mt-1 w-full bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto"
        : "absolute top-full mt-1 w-full bg-white border rounded shadow-lg z-10";

    return (
        <div className={`col-md-${display.col} mb-3`} ref={inputRef}>
            <label htmlFor={name} className="form-label font-semibold">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search} // Keep the search input text, not the selected count
                    onChange={handleInputChange} // Update search term
                    onClick={() => setIsDropdownVisible(true)} // Always open dropdown on click
                    onKeyDown={handleKeyDown} // Handle keyboard navigation
                    className="form-control"
                    aria-label={label}
                />
                {isDropdownVisible && filteredOptions.length > 0 && (
                    <div className={dropdownClasses}>
                        {filteredOptions.map((option, index) => (
                            <div
                                key={option}
                                onClick={() => toggleOption(option)} // Toggle selection on click
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${highlightedIndex === index ? "bg-gray-200" : ""}`}
                            >
                                <span className="mr-2">
                                    {selectedOptions.includes(option) ? "−" : "+"} {/* Show + or - */}
                                </span>
                                {option}
                            </div>
                        ))}
                    </div>
                )}
                {isDropdownVisible && filteredOptions.length === 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded shadow-lg z-10 px-4 py-2 text-gray-500">
                        No options found
                    </div>
                )}
            </div>
            {/* Display selected count below input */}
            <div className="mt-2 text-sm text-gray-500">
                {selectedOptions.length > 0
                    ? `${selectedOptions.length} option${selectedOptions.length > 1 ? "s" : ""} selected`
                    : "No options selected"}
            </div>
        </div>
    );
};

export default DocumentTypeFormikSingleSelect;
