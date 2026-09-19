import React, { useRef, useState } from 'react';
import { Edit3, ImagePlus, Plus, Save, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

const emptyForm: Omit<Category, 'id'> = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
  icon: '',
  is_active: true,
  display_order: 0,
};

export const AdminCategories: React.FC = () => {
  const {
    categories = [],
    products = [],
    addCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Category, 'id'>>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const startAdd = () => {
    setForm({
      ...emptyForm,
      display_order: categories.length,
    });
    setEditingId(null);
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const startEdit = (category: Category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      icon: category.icon || '',
      is_active: category.is_active,
      display_order: category.display_order || 0,
    });
    setEditingId(category.id);
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: editingId ? prev.slug : slug,
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file is too large. Please select an image under 15MB.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await uploadCategoryImage(file);

      if (!result.success || !result.url) {
        setError(result.error || 'The category image could not be uploaded.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        image_url: result.url,
      }));

      setSuccess('Category image uploaded successfully.');
    } catch (err) {
      console.error('Category image upload failed:', err);
      setError('The category image could not be uploaded. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    const name = form.name.trim();

    if (!name) {
      setError('Please enter a category name.');
      return;
    }

    setSaving(true);

    try {
      const slug =
        form.slug.trim() ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const payload: Omit<Category, 'id'> = {
        ...form,
        name,
        slug,
        description: form.description?.trim() || '',
        image_url: form.image_url || '',
        icon: form.icon?.trim() || '',
        is_active: form.is_active,
        display_order: Number(form.display_order) || 0,
      };

      if (editingId) {
        updateCategory({
          id: editingId,
          ...payload,
        });

        setSuccess('Category updated successfully.');
      } else {
        addCategory(payload);
        setSuccess('Category added successfully.');
      }

      setIsEditing(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error('Category save failed:', err);
      setError('The category could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (category: Category) => {
    const productsUsingCategory = products.filter(
      (product) => product.category_id === category.id
    );

    if (productsUsingCategory.length > 0) {
      setError(
        `Cannot delete "${category.name}" because ${productsUsingCategory.length} product${
          productsUsingCategory.length === 1 ? '' : 's'
        } ${productsUsingCategory.length === 1 ? 'is' : 'are'} assigned to it. Reassign or remove those products first.`
      );
      setSuccess('');
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      deleteCategory(category.id);

      if (editingId === category.id) {
        resetForm();
      }

      setSuccess(`"${category.name}" was deleted.`);
      setError('');
    } catch (err) {
      console.error('Category deletion failed:', err);
      setError('The category could not be deleted. Please try again.');
    }
  };
  const sortedCategories = [...categories].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store categories and their images.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-medium">
          {success}
        </div>
      )}

      {isEditing && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Changes will be saved to your store database.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Close category editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Baby Feeding"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="baby-feeding"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Describe this category..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={form.display_order ?? 0}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    display_order: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm font-bold text-slate-700">
                  Active category
                </span>
              </label>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Category Image
              </label>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt={form.name || 'Category preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400 px-4">
                      <ImagePlus className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-xs">
                        No category image
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ImagePlus className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        void handleImageUpload(file);
                      }
                      e.currentTarget.value = '';
                    }}
                  />

                  <p className="text-xs text-slate-500 mt-2">
                    Use a clear category image. Maximum file size: 15MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </div>
      )}

      {!isEditing && sortedCategories.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <ImagePlus className="w-7 h-7 text-slate-400" />
          </div>

          <h2 className="text-lg font-black text-slate-900">
            No categories yet
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Create your first category. It will appear automatically on the
            storefront once it is active.
          </p>

          <button
            type="button"
            onClick={startAdd}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            Create First Category
          </button>
        </div>
      )}

      {!isEditing && sortedCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="h-40 bg-slate-100">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImagePlus className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      /{category.slug}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      category.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {category.description && (
                  <p className="text-sm text-slate-500 mt-3 line-clamp-3">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400">
                    Order: {category.display_order || 0}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};





