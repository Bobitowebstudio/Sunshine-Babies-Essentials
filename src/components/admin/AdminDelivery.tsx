import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Truck,
  Check,
  X,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Banknote,
  ShieldCheck,
  Power,
  Sparkles,
  Info,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { DeliveryLocation } from '../../types';
import { INITIAL_DELIVERY_LOCATIONS } from '../../lib/constants';

const COMMON_NIGERIAN_STATES = [
  'Lagos',
  'Abuja (FCT)',
  'Rivers',
  'Oyo',
  'Ogun',
  'Enugu',
  'Anambra',
  'Delta',
  'Edo',
  'Kano',
  'Kaduna',
  'Imo',
  'Abia',
  'Akwa Ibom',
  'Nationwide (Other States)',
];

const TIMELINE_PRESETS = [
  'Same Day Delivery',
  '1 - 2 Business Days',
  '2 - 3 Business Days',
  '2 - 4 Business Days',
  '3 - 5 Business Days',
  '4 - 7 Business Days',
];

export const AdminDelivery: React.FC = () => {
  const {
    deliveryLocations = [],
    addDeliveryLocation,
    updateDeliveryLocation,
    deleteDeliveryLocation,
    companySettings,
  } = useStore();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<DeliveryLocation | null>(null);

  // Delete confirmation modal state
  const [locationToDelete, setLocationToDelete] = useState<DeliveryLocation | null>(null);

  // Success Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formState, setFormState] = useState('Lagos');
  const [formCityArea, setFormCityArea] = useState('');
  const [formFee, setFormFee] = useState<string>('2500');
  const [formEstimatedDays, setFormEstimatedDays] = useState('1 - 2 Business Days');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Show toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open modal for Adding a new location
  const handleOpenAddModal = () => {
    setEditingLocation(null);
    setFormState('Lagos');
    setFormCityArea('');
    setFormFee('3000');
    setFormEstimatedDays('1 - 2 Business Days');
    setFormIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing location
  const handleOpenEditModal = (loc: DeliveryLocation) => {
    setEditingLocation(loc);
    setFormState(loc.state);
    setFormCityArea(loc.city_area);
    setFormFee(String(loc.fee));
    setFormEstimatedDays(loc.estimated_days);
    setFormIsActive(loc.is_active !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Fast toggle active status directly from the table
  const handleToggleActive = (loc: DeliveryLocation) => {
    const updated: DeliveryLocation = {
      ...loc,
      is_active: !loc.is_active,
    };
    updateDeliveryLocation(updated);
    showToast(
      `Zone "${loc.state} - ${loc.city_area}" is now ${
        updated.is_active ? 'Active & available in checkout' : 'Disabled from customer checkout'
      }.`
    );
  };

  // Handle Form Submission (Add or Edit)
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedState = formState.trim();
    const trimmedCityArea = formCityArea.trim();
    const trimmedDays = formEstimatedDays.trim();
    const parsedFee = Number(formFee);

    // Validation
    if (!trimmedState) {
      setFormError('State name cannot be empty.');
      return;
    }
    if (!trimmedCityArea) {
      setFormError('City / Area Coverage cannot be empty.');
      return;
    }
    if (isNaN(parsedFee) || parsedFee < 0) {
      setFormError('Delivery Fee must be a valid non-negative number.');
      return;
    }
    if (!trimmedDays) {
      setFormError('Estimated Delivery Time cannot be empty.');
      return;
    }

    if (editingLocation) {
      // Edit existing location
      const updated: DeliveryLocation = {
        id: editingLocation.id,
        state: trimmedState,
        city_area: trimmedCityArea,
        fee: parsedFee,
        estimated_days: trimmedDays,
        is_active: formIsActive,
      };
      updateDeliveryLocation(updated);
      showToast(`Updated "${trimmedState} - ${trimmedCityArea}" (Fee: ${formatCurrency(parsedFee, companySettings.currency_symbol)}).`);
    } else {
      // Create new location
      addDeliveryLocation({
        state: trimmedState,
        city_area: trimmedCityArea,
        fee: parsedFee,
        estimated_days: trimmedDays,
        is_active: formIsActive,
      });
      showToast(`Added new delivery zone "${trimmedState} - ${trimmedCityArea}".`);
    }

    setIsModalOpen(false);
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = () => {
    if (!locationToDelete) return;
    const deletedName = `${locationToDelete.state} - ${locationToDelete.city_area}`;
    deleteDeliveryLocation(locationToDelete.id);
    setLocationToDelete(null);
    showToast(`Deleted delivery zone "${deletedName}".`);
  };

  // Reset to default Nigerian locations if list is empty
  const handleRestoreDefaults = () => {
    if (window.confirm('Restore initial Nigerian delivery zones and standard rates?')) {
      INITIAL_DELIVERY_LOCATIONS.forEach((loc) => {
        addDeliveryLocation({
          state: loc.state,
          city_area: loc.city_area,
          fee: loc.fee,
          estimated_days: loc.estimated_days,
          is_active: loc.is_active,
        });
      });
      showToast('Restored default Nigerian shipping destinations.');
    }
  };

  // Extract unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = new Set(deliveryLocations.map((l) => l.state));
    return Array.from(states).sort();
  }, [deliveryLocations]);

  // Filtered and searched delivery locations
  const filteredLocations = useMemo(() => {
    return deliveryLocations.filter((loc) => {
      // Search term match
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        loc.state.toLowerCase().includes(query) ||
        loc.city_area.toLowerCase().includes(query) ||
        loc.estimated_days.toLowerCase().includes(query) ||
        String(loc.fee).includes(query);

      // Status match
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && loc.is_active) ||
        (statusFilter === 'disabled' && !loc.is_active);

      // State match
      const matchesState = stateFilter === 'all' || loc.state === stateFilter;

      return matchesSearch && matchesStatus && matchesState;
    });
  }, [deliveryLocations, searchTerm, statusFilter, stateFilter]);

  // Statistics calculation
  const totalCount = deliveryLocations.length;
  const activeCount = deliveryLocations.filter((l) => l.is_active).length;
  const disabledCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-serif font-black text-slate-900">
              Delivery Zones &amp; Shipping Rates
            </h2>
            <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-xs">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure real-time delivery fees, coverage areas, and estimated timelines for customer checkout.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {totalCount === 0 && (
            <button
              onClick={handleRestoreDefaults}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Default Zones</span>
            </button>
          )}

          <button
            id="admin-add-delivery-zone-btn"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Delivery Zone</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Total Destinations
            </p>
            <p className="text-lg font-black text-slate-900">{totalCount} Zones</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Active in Checkout
            </p>
            <p className="text-lg font-black text-emerald-700">{activeCount} Enabled</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Disabled Zones
            </p>
            <p className="text-lg font-black text-slate-600">{disabledCount} Inactive</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state, city, area or delivery rate..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* State Filter Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All States ({uniqueStates.length})</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('disabled')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'disabled'
                  ? 'bg-white text-slate-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Disabled ({disabledCount})
            </button>
          </div>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">City / Area Coverage</th>
                <th className="py-3.5 px-4">Delivery Rate</th>
                <th className="py-3.5 px-4">Estimated Delivery Time</th>
                <th className="py-3.5 px-4">Customer Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <tr
                    key={loc.id}
                    className={`transition-colors ${
                      loc.is_active ? 'hover:bg-slate-50/70' : 'bg-slate-50/40 text-slate-400'
                    }`}
                  >
                    {/* State */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{loc.state}</span>
                      </div>
                    </td>

                    {/* City / Area Coverage */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <span className={loc.is_active ? 'text-slate-800' : 'text-slate-500'}>
                        {loc.city_area}
                      </span>
                    </td>

                    {/* Delivery Rate */}
                    <td className="py-3.5 px-4 font-black text-amber-900 text-sm">
                      {formatCurrency(loc.fee, companySettings.currency_symbol)}
                    </td>

                    {/* Estimated Delivery Window */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">{loc.estimated_days}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          loc.is_active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            loc.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {loc.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    {/* Actions: Edit, Toggle Status, Delete */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Action Button */}
                        <button
                          onClick={() => handleOpenEditModal(loc)}
                          title="Edit delivery zone"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors cursor-pointer border border-amber-200/80"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Edit</span>
                        </button>

                        {/* Enable/Disable Toggle Button */}
                        <button
                          onClick={() => handleToggleActive(loc)}
                          title={loc.is_active ? 'Click to Disable' : 'Click to Enable'}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                            loc.is_active
                              ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                          }`}
                        >
                          {loc.is_active ? 'Disable' : 'Enable'}
                        </button>

                        {/* Delete Action Button */}
                        <button
                          onClick={() => setLocationToDelete(loc)}
                          title="Delete delivery zone"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Truck className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <p className="font-semibold text-slate-700 text-sm">No delivery zones found</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {searchTerm || statusFilter !== 'all' || stateFilter !== 'all'
                          ? 'Try resetting your search query or filters to see all shipping zones.'
                          : 'You haven’t added any delivery zones yet. Click "Add Delivery Zone" above.'}
                      </p>
                      {(searchTerm || statusFilter !== 'all' || stateFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setStateFilter('all');
                          }}
                          className="mt-2 text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT DELIVERY ZONE MODAL FORM */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {editingLocation ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingLocation ? 'Edit Delivery Zone & Rates' : 'Add New Delivery Zone'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingLocation
                      ? `Updating details for ${editingLocation.state} - ${editingLocation.city_area}`
                      : 'Configure a new Nigerian delivery destination and rate for customers'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLocation} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. State Field with suggestions */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    placeholder="e.g. Lagos, Abuja (FCT), Rivers"
                    list="state-suggestions-list"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold text-slate-900"
                  />
                  <datalist id="state-suggestions-list">
                    {COMMON_NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st} />
                    ))}
                  </datalist>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Choose from suggestions or type any state
                  </span>
                </div>

                {/* 2. Delivery Fee Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Delivery Fee ({companySettings.currency_symbol}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      {companySettings.currency_symbol}
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={100}
                      value={formFee}
                      onChange={(e) => setFormFee(e.target.value)}
                      placeholder="2500"
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold text-amber-900 text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Preview: {formatCurrency(Number(formFee) || 0, companySettings.currency_symbol)}
                  </span>
                </div>

                {/* 3. City / Area Coverage */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    City / Area Coverage *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCityArea}
                    onChange={(e) => setFormCityArea(e.target.value)}
                    placeholder="e.g. Island (VI, Ikoyi, Lekki, Ajah) or Port Harcourt (GRA, Trans Amadi)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Specific neighborhoods, landmarks, or delivery clusters covered by this fee.
                  </span>
                </div>

                {/* 4. Estimated Delivery Time */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Estimated Delivery Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formEstimatedDays}
                    onChange={(e) => setFormEstimatedDays(e.target.value)}
                    placeholder="e.g. 1 - 2 Business Days"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                      Presets:
                    </span>
                    {TIMELINE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormEstimatedDays(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                          formEstimatedDays === preset
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Status: Active vs Disabled */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Delivery Zone Status
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {formIsActive
                          ? 'Active: Customers can select this location at checkout.'
                          : 'Disabled: Hidden from checkout. Existing orders are not affected.'}
                      </span>
                    </div>

                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                    </div>
                  </label>
                </div>

                {/* Live Checkout Preview Box */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Customer Checkout Preview</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-amber-100">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-900 block truncate">
                        {formState || 'State'} — {formCityArea || 'City / Area'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Est. Delivery: {formEstimatedDays || 'Estimated time'}
                      </span>
                    </div>
                    <span className="font-black text-amber-900 shrink-0">
                      {formatCurrency(Number(formFee) || 0, companySettings.currency_symbol)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="admin-save-delivery-zone-btn"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLocation ? 'Save Changes' : 'Create Delivery Zone'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {locationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-in p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Delivery Zone?</h3>
                <p className="text-xs text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
              <p className="text-slate-600 font-semibold">
                Are you sure you want to permanently delete this delivery zone?
              </p>
              <div className="pt-2 font-bold text-slate-900">
                📍 {locationToDelete.state} — {locationToDelete.city_area}
              </div>
              <div className="text-slate-600">
                Fee: {formatCurrency(locationToDelete.fee, companySettings.currency_symbol)} | Est: {locationToDelete.estimated_days}
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Customers will no longer be able to select this delivery zone during checkout.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLocationToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Delivery Zone</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
