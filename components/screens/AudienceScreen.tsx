import React, { useState, useRef, useEffect, useMemo } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, CloseIcon, DownloadIcon, UploadIcon, TrashIcon, PencilIcon, UsersGroupIcon, ChevronDownIcon, SearchIcon } from '../Icons';
import { Audience } from '../../types';
import { useToast } from '../../hooks/useToast';
import ConfirmationDialog from '../shared/ConfirmationDialog';


interface AudienceScreenProps {
  audiences?: Audience[];
  setAudiences?: React.Dispatch<React.SetStateAction<Audience[]>>;
  onSave: (audience: Audience) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

// --- SUB-COMPONENTS ---

const CROP_OPTIONS = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Potato', 'Tomato', 'Onion', 'Chilli', 'Groundnut', 'Mustard'];
const MOCK_COUNTRIES = ['India'];
const MOCK_STATES = ['Punjab', 'Uttar Pradesh', 'Maharashtra', 'Haryana', 'Rajasthan', 'Madhya Pradesh'];
const MOCK_DISTRICTS = ['Amritsar', 'Ludhiana', 'Lucknow', 'Mumbai', 'Jaipur', 'Indore'];
const MOCK_SUB_DISTRICTS = ['Ajnala', 'Sadar', 'Mohanlalganj', 'Andheri', 'Sanganer', 'Mhow'];


interface TagPickerProps {
  label: string;
  id: string;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableOptions: string[];
}

const TagPicker: React.FC<TagPickerProps> = ({ label, id, selectedTags, setSelectedTags, availableOptions }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setSuggestionsVisible(false);
        }
    };

    if (suggestionsVisible) {
        document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionsVisible]);

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = availableOptions.filter(
    option =>
      !selectedTags.includes(option) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <div 
        ref={containerRef} 
        className="relative"
      >
        <div 
          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 flex flex-wrap items-center gap-2"
          onClick={() => inputRef.current?.focus()}
        >
          {selectedTags.map(tag => (
            <span key={tag} className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium px-2 py-1 rounded-md animate-fade-in">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-emerald-600 hover:text-emerald-800"
                aria-label={`Remove ${tag}`}
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onFocus={() => setSuggestionsVisible(true)}
            placeholder={selectedTags.length > 0 ? "Add more..." : "Search for a crop..."}
            className="flex-grow bg-transparent focus:outline-none text-sm p-1"
          />
        </div>
        {suggestionsVisible && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul>
              {filteredSuggestions.map(suggestion => (
                <li
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  className="px-3 py-2 cursor-pointer hover:bg-emerald-50 text-sm"
                  tabIndex={0}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

interface SearchableSelectProps {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, id, options, value, onChange, placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left flex justify-between items-center"
                >
                    <span className={value ? 'text-stone-800' : 'text-stone-500'}>{value || placeholder}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 flex flex-col">
                        <div className="p-2 border-b border-stone-200">
                            <input
                                type="text"
                                placeholder="Search..."
                                autoFocus
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <ul className="overflow-y-auto">
                            {filteredOptions.length > 0 ? filteredOptions.map(option => (
                                <li
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className="px-3 py-2 cursor-pointer hover:bg-emerald-50 text-sm"
                                >
                                    {option}
                                </li>
                            )) : <li className="px-3 py-2 text-sm text-stone-500">No results found</li>}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

const CreateAudienceForm: React.FC<{
  onClose: () => void;
  onSave: (audience: Audience) => void;
  initialData?: Audience | null;
}> = ({ onClose, onSave, initialData }) => {
    const { addToast } = useToast();
    const isEditing = !!initialData;

    const [audienceName, setAudienceName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [creationMethod, setCreationMethod] = useState<'filters' | 'import'>('filters');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    // Filter states
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [subDistrict, setSubDistrict] = useState('');
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

    useEffect(() => {
        if (isEditing && initialData) {
            setAudienceName(initialData.name);
            setDescription(initialData.description);
            setStatus(initialData.status === 'Active');
        }
    }, [initialData, isEditing]);
    
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!audienceName.trim()) {
            newErrors.audienceName = "Audience Name is required.";
        }
        if (creationMethod === 'import' && !uploadedFile && !isEditing) { // Don't validate file on edit
            newErrors.file = "A CSV file must be uploaded for manual import.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSave = () => {
        if (!validateForm()) {
            addToast('Please correct the errors before saving.', 'error');
            return;
        }
        // FIX: The generated ID should be a string to match the updated type definition.
        const newAudience: Audience = {
            id: isEditing ? initialData.id : `${audienceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            name: audienceName,
            description: description,
            userCount: isEditing ? initialData.userCount : (uploadedFile ? 1337 : Math.floor(Math.random() * 5000) + 200),
            status: status ? 'Active' : 'Inactive',
            createdAt: isEditing ? initialData.createdAt : new Date().toISOString().split('T')[0],
        };
        onSave(newAudience);
    };

    const handleDownloadFormat = () => {
        const csvContent = "phone_number,first_name,last_name,city,crop_preference\n+919876543210,Ram,Kumar,Amritsar,Wheat\n+919876543211,Sita,Devi,Ludhiana,Rice";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "audience_template.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
                setUploadedFile(files[0]);
                setErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors.file;
                    return newErrors;
                });
            } else {
                addToast('Please upload a valid CSV file.', 'error');
            }
        }
    };

    // Drag & Drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };


    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} aria-modal="true">
            <div 
                className="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh] animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <header className="flex justify-between items-center p-5 border-b border-stone-200 bg-white flex-shrink-0">
                    <h2 className="text-xl font-bold text-stone-800">{isEditing ? 'Edit Audience' : 'Create Audience'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-stone-500 hover:bg-stone-100">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                {/* Form Body */}
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4">Audience Details</h3>
                        <div className="space-y-4">
                            <InputField 
                                label="Audience Name" 
                                id="audienceName" 
                                value={audienceName} 
                                onChange={(e) => {
                                    setAudienceName(e.target.value);
                                    setErrors(prev => {
                                        const newErrors = {...prev};
                                        delete newErrors.audienceName;
                                        return newErrors;
                                    });
                                }} 
                                required 
                                placeholder="e.g., High-Value Farmers (Punjab)"
                                error={errors.audienceName}
                            />
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A short description of who is in this audience." className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                            </div>
                        </div>
                    </Card>

                    {!isEditing && (
                        <Card>
                            <h3 className="text-lg font-semibold text-stone-800 mb-4">Creation Method</h3>
                            <div className="inline-flex rounded-lg border border-stone-300 p-1 bg-stone-100">
                                <Button
                                    variant={creationMethod === 'filters' ? 'primary' : 'outline'}
                                    onClick={() => setCreationMethod('filters')}
                                    className={`px-6 py-2 transition-colors duration-200 ${creationMethod === 'filters' ? 'shadow' : 'bg-transparent border-transparent shadow-none text-stone-600 hover:bg-white'}`}
                                >
                                    Use Filters
                                </Button>
                                 <Button
                                    variant={creationMethod === 'import' ? 'primary' : 'outline'}
                                    onClick={() => setCreationMethod('import')}
                                    className={`px-6 py-2 transition-colors duration-200 ${creationMethod === 'import' ? 'shadow' : 'bg-transparent border-transparent shadow-none text-stone-600 hover:bg-white'}`}
                                >
                                    Manual Import
                                </Button>
                            </div>
                        </Card>
                    )}
                    
                    {creationMethod === 'filters' && !isEditing && (
                        <>
                            <Card>
                                <h3 className="text-lg font-semibold text-stone-800 mb-1">Audience Filters</h3>
                                <p className="text-sm text-stone-500 mb-4">Create rules to dynamically add users to this audience.</p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium text-stone-600 border-b border-stone-200 pb-2 mb-4">Location</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <SearchableSelect label="Country" id="country" options={MOCK_COUNTRIES} value={country} onChange={setCountry} placeholder="Select country..." />
                                            <SearchableSelect label="State" id="state" options={MOCK_STATES} value={state} onChange={setState} placeholder="Select state..." />
                                            <SearchableSelect label="District" id="district" options={MOCK_DISTRICTS} value={district} onChange={setDistrict} placeholder="Select district..." />
                                            <SearchableSelect label="SubDistrict" id="subdistrict" options={MOCK_SUB_DISTRICTS} value={subDistrict} onChange={setSubDistrict} placeholder="Select sub-district..." />
                                            <InputField label="Pincode" id="pincode" type="number" placeholder="e.g., 143001"/>
                                        </div>
                                    </div>
                                    <TagPicker
                                        label="Crops"
                                        id="crops"
                                        selectedTags={selectedCrops}
                                        setSelectedTags={setSelectedCrops}
                                        availableOptions={CROP_OPTIONS}
                                    />
                                </div>
                            </Card>
                            <Card className="flex flex-col items-center justify-center text-center bg-emerald-50 border-emerald-200">
                                <UsersGroupIcon className="w-12 h-12 text-emerald-500 mb-2"/>
                                <h3 className="text-lg font-semibold text-stone-800">Estimated Users</h3>
                                <p className="text-4xl font-bold text-emerald-600 my-2">0</p>
                                <p className="text-sm text-stone-500">Estimates will update based on your filter selections.</p>
                            </Card>
                        </>
                    )}

                    {creationMethod === 'import' && !isEditing && (
                        <Card className="flex flex-col">
                           <h3 className="text-lg font-semibold text-stone-800">Manual Import</h3>
                           <p className="text-sm text-stone-500 mb-4">Upload a CSV file to add users. Download the sample for the correct format.</p>
                           <div className="mt-auto space-y-4">
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} accept=".csv" className="hidden" />
                                {!uploadedFile ? (
                                    <>
                                        <div 
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${errors.file ? 'border-red-500 bg-red-50' : isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}`}
                                        >
                                            <UploadIcon className="w-8 h-8 text-stone-400" />
                                            <p className="mt-2 text-sm text-stone-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-stone-500">CSV file only</p>
                                        </div>
                                        {errors.file && <p className="text-xs text-red-600 text-center">{errors.file}</p>}
                                    </>
                                ) : (
                                    <div className="p-3 border border-stone-300 rounded-lg bg-emerald-50/50 flex items-center justify-between">
                                        <div className="flex items-center min-w-0">
                                            <UsersGroupIcon className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                                            <p className="ml-3 text-sm font-medium text-emerald-900 truncate" title={uploadedFile.name}>{uploadedFile.name}</p>
                                        </div>
                                        <Button variant="outline" className="p-1.5 text-red-600 hover:bg-red-50 border-red-200 ml-2 flex-shrink-0" onClick={() => setUploadedFile(null)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                               <Button variant="outline" icon={<DownloadIcon className="w-5 h-5"/>} className="w-full" onClick={handleDownloadFormat}>Download Sample CSV Format</Button>
                           </div>
                        </Card>
                    )}

                    <Card>
                        <h3 className="text-lg font-semibold text-stone-800 mb-4">Status</h3>
                         <div className="flex items-center space-x-3">
                             <label htmlFor="statusToggle" className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="statusToggle" className="sr-only peer" checked={status} onChange={() => setStatus(!status)} />
                                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                            <span className="font-medium text-stone-700">{status ? 'Active' : 'Inactive'}</span>
                         </div>
                    </Card>
                </div>
                {/* Footer */}
                <footer className="flex justify-end items-center p-4 border-t border-stone-200 bg-white/80 backdrop-blur-sm flex-shrink-0 space-x-3">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Audience</Button>
                </footer>
            </div>
        </div>
    );
};

// Helper components for the form
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        <input 
            id={id} 
            {...props} 
            className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-emerald-500'}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


const AudienceRow: React.FC<{ audience: Audience; onEdit: () => void; onDelete: () => void; }> = ({ audience, onEdit, onDelete }) => {
    const statusClasses: Record<Audience['status'], string> = {
        Active: 'bg-emerald-100 text-emerald-800',
        Inactive: 'bg-stone-200 text-stone-800',
    };
    return (
        <tr className="hover:bg-stone-50/80">
            <td className="px-5 py-4 font-medium text-stone-800">{audience.name}</td>
            <td className="px-5 py-4 text-stone-600 max-w-sm truncate" title={audience.description}>{audience.description}</td>
            <td className="px-5 py-4 text-stone-600">{audience.createdAt}</td>
            <td className="px-5 py-4 text-stone-600 text-right font-medium">{audience.userCount.toLocaleString()}</td>
            <td className="px-5 py-4 text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[audience.status]}`}>
                    {audience.status}
                </span>
            </td>
            <td className="px-5 py-4">
                <div className="flex justify-center space-x-2">
                    <Button variant="outline" className="p-1.5" onClick={onEdit}><PencilIcon className="w-4 h-4" /></Button>
                    <Button variant="outline" className="p-1.5 text-red-600 hover:bg-red-50 border-red-200" onClick={onDelete}><TrashIcon className="w-4 h-4" /></Button>
                </div>
            </td>
        </tr>
    );
};

// --- MAIN COMPONENT ---
const AudienceScreen: React.FC<AudienceScreenProps> = ({ audiences = [], setAudiences = () => {}, onSave, onCancel, isModal = false }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [audienceToEdit, setAudienceToEdit] = useState<Audience | null>(null);
    const [audienceToDelete, setAudienceToDelete] = useState<Audience | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { addToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        if(isModal) {
            setIsFormOpen(true);
        }
    }, [isModal]);

    const handleCreateClick = () => {
        setAudienceToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (audience: Audience) => {
        setAudienceToEdit(audience);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (audience: Audience) => {
        setAudienceToDelete(audience);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (audienceToDelete) {
            setAudiences(audiences.filter(a => a.id !== audienceToDelete.id));
            addToast(`Audience "${audienceToDelete.name}" deleted.`, 'success');
        }
        setIsConfirmOpen(false);
        setAudienceToDelete(null);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setAudienceToEdit(null);
        if (onCancel) {
            onCancel();
        }
    };

    const handleSaveAudience = (audienceData: Audience) => {
        onSave(audienceData);
        if (!isModal) {
            setIsFormOpen(false);
            setAudienceToEdit(null);
        }
    };

    const filteredAudiences = useMemo(() => {
        return audiences
            .filter(a => statusFilter === 'All' || a.status === statusFilter)
            .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [audiences, statusFilter, searchTerm]);

    const paginatedAudiences = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredAudiences.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAudiences, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredAudiences.length / rowsPerPage);

    const mainContent = (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800">Audience</h2>
                    <p className="text-stone-500 mt-1">Manage your user segments and audience lists.</p>
                </div>
                <Button icon={<PlusIcon />} onClick={handleCreateClick}>Create Audience</Button>
            </div>

            <Card className="overflow-hidden p-0 flex flex-col">
                <div className="p-4 flex flex-wrap gap-4 items-center border-b border-stone-200">
                    <div className="relative flex-grow min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search audiences..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b-2 border-stone-200 text-xs text-stone-500 uppercase bg-stone-50">
                            <tr>
                                <th scope="col" className="px-5 py-3 font-semibold text-left">Audience Name</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-left">Description</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-left">Created Date</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-right">User Count</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-center">Status</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {paginatedAudiences.map(audience => <AudienceRow key={audience.id} audience={audience} onEdit={() => handleEditClick(audience)} onDelete={() => handleDeleteClick(audience)} />)}
                        </tbody>
                    </table>
                </div>
                 {filteredAudiences.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-stone-500 font-semibold">No audiences found</p>
                        <p className="text-sm text-stone-400 mt-1">Try adjusting your search or filters.</p>
                    </div>
                 )}
                 {filteredAudiences.length > 0 && (
                    <div className="p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                            <span>Rows per page:</span>
                            <select 
                                value={rowsPerPage} 
                                onChange={e => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-white border border-stone-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                        <span className="text-sm text-stone-600">
                            {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredAudiences.length)} of {filteredAudiences.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="p-2" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </Button>
                            <div className="text-sm font-medium px-2">
                                <input
                                    type="number"
                                    value={currentPage}
                                    onChange={(e) => {
                                        const page = e.target.value ? Number(e.target.value) : 1;
                                        if(page > 0 && page <= totalPages) setCurrentPage(page);
                                    }}
                                    className="w-12 text-center bg-stone-100 rounded-md border border-stone-300"
                                />
                                / {totalPages}
                            </div>
                            <Button variant="outline" className="p-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Button>
                        </div>
                    </div>
                 )}
            </Card>
        </div>
    );

    return (
        <>
            {!isModal && mainContent}
            {isFormOpen && <CreateAudienceForm onClose={handleFormClose} onSave={handleSaveAudience} initialData={audienceToEdit} />}
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Audience"
                message={`Are you sure you want to delete the audience "${audienceToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </>
    );
};

export default AudienceScreen;