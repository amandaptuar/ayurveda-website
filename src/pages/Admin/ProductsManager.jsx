import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'GENERAL WELLNESS',
    price: '',
    original_price: '',
    image_url: '',
    additional_images: [],
    status: 'active',
    is_bestseller: false,
    is_combo: false,
    benefits: [''],
    sizes: [{ name: 'Starter Pack', price: '', original_price: '', volume: '1000 ml x 1', saveText: 'Save ₹0' }]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category || 'GENERAL WELLNESS',
        price: product.price,
        original_price: product.original_price || '',
        image_url: product.image_url || '',
        additional_images: product.additional_images || [],
        status: product.status,
        is_bestseller: product.is_bestseller || false,
        is_combo: product.is_combo || false,
        benefits: product.benefits?.length ? product.benefits : [''],
        sizes: product.sizes?.length ? product.sizes : [{ name: '', price: '', original_price: '', volume: '', saveText: '' }]
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'GENERAL WELLNESS',
        price: '',
        original_price: '',
        image_url: '',
        additional_images: [],
        status: 'active',
        is_bestseller: false,
        is_combo: false,
        benefits: [''],
        sizes: [{ name: 'Starter Pack', price: '', original_price: '', volume: '1000 ml x 1', saveText: 'Save ₹0' }]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Generic dynamic list handlers
  const handleListChange = (listName, index, value) => {
    const newList = [...formData[listName]];
    newList[index] = value;
    setFormData({ ...formData, [listName]: newList });
  };

  const addToList = (listName) => {
    if (listName === 'additional_images' && formData.additional_images.length >= 4) {
      toast.error("Maximum 4 additional images allowed");
      return;
    }
    setFormData({ ...formData, [listName]: [...formData[listName], ''] });
  };
  
  const removeFromList = (listName, index) => {
    const newList = formData[listName].filter((_, i) => i !== index);
    // Images array can be empty, benefits should have at least 1 empty string ideally, but let's allow empty.
    setFormData({ ...formData, [listName]: newList });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => {
    setFormData({ 
      ...formData, 
      sizes: [...formData.sizes, { name: '', price: '', original_price: '', volume: '', saveText: '' }] 
    });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes.length ? newSizes : [{ name: '', price: '', original_price: '', volume: '', saveText: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty strings in arrays
      const cleanedData = {
        ...formData,
        original_price: formData.original_price || null,
        benefits: formData.benefits.filter(b => typeof b === 'string' && b.trim() !== ''),
        additional_images: formData.additional_images.filter(img => typeof img === 'string' && img.trim() !== ''),
        sizes: formData.sizes.filter(s => s.name.trim() !== '')
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(cleanedData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([cleanedData]);
        if (error) throw error;
        toast.success('Product created successfully');
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      toast.error('Error saving product. Check if additional_images column exists in Supabase.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        if (error) throw error;
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Error deleting product');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="admin-header-actions">
        <div>
          <h1 className="admin-title">Products Inventory</h1>
          <p style={{color: 'var(--admin-text-secondary)', marginTop: '8px'}}>Manage your store's products and variations.</p>
        </div>
        <button className="admin-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} /> New Product
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>Loading products...</td></tr>
              ) : products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0', borderRadius: '8px', border: '1px solid var(--admin-border)' }}></div>
                      )}
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>{product.name}</div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {product.is_bestseller && <span style={{fontSize: '0.65rem', padding: '2px 6px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', fontWeight: 'bold'}}>Bestseller</span>}
                          {product.is_combo && <span style={{fontSize: '0.65rem', padding: '2px 6px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '4px', fontWeight: 'bold'}}>Combo</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{product.category || 'N/A'}</td>
                  <td>
                    <div style={{fontWeight: '600'}}>₹{Number(product.price).toFixed(2)}</div>
                    {product.original_price && <div style={{fontSize: '0.8rem', color: 'var(--admin-text-secondary)', textDecoration: 'line-through'}}>₹{Number(product.original_price).toFixed(2)}</div>}
                  </td>
                  <td>
                    <span className={`admin-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-icon-only" onClick={() => handleOpenModal(product)} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon-only" style={{color: 'var(--admin-danger)'}} onClick={() => handleDelete(product.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-secondary)' }}>
                    <div>No products found. Click "New Product" to create one.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
              <button onClick={handleCloseModal} className="btn-icon-only">
                <X size={24} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              <form id="productForm" onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                
                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group" style={{marginBottom: 0}}>
                    <label className="admin-label">Product Name</label>
                    <input type="text" className="admin-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="admin-form-group" style={{marginBottom: 0}}>
                    <label className="admin-label">Category</label>
                    <input type="text" className="admin-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                  </div>
                </div>

                <div className="admin-form-group" style={{marginBottom: 0}}>
                  <label className="admin-label">Description (Subtitle)</label>
                  <textarea className="admin-input" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" />
                </div>

                {/* Pricing & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group" style={{marginBottom: 0}}>
                    <label className="admin-label">Current Price (₹)</label>
                    <input type="number" step="0.01" className="admin-input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="admin-form-group" style={{marginBottom: 0}}>
                    <label className="admin-label">Original Price (₹)</label>
                    <input type="number" step="0.01" className="admin-input" value={formData.original_price} onChange={(e) => setFormData({...formData, original_price: e.target.value})} placeholder="Optional" />
                  </div>
                  <div className="admin-form-group" style={{marginBottom: 0}}>
                    <label className="admin-label">Status</label>
                    <select className="admin-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="active">Active (Visible)</option>
                      <option value="out_of_stock">Out of Stock (Hidden)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Special Tags */}
                <div style={{ display: 'flex', gap: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                    <input type="checkbox" checked={formData.is_bestseller} onChange={(e) => setFormData({...formData, is_bestseller: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }} />
                    Mark as Bestseller
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                    <input type="checkbox" checked={formData.is_combo} onChange={(e) => setFormData({...formData, is_combo: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }} />
                    Mark as Combo Deal
                  </label>
                </div>

                <div className="admin-form-group" style={{marginBottom: 0}}>
                  <label className="admin-label">Main Image URL</label>
                  <input type="url" className="admin-input" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                </div>

                {/* Additional Images */}
                <div className="dynamic-list-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="admin-label" style={{marginBottom: 0}}>Additional Images (Up to 4)</label>
                    <button type="button" onClick={() => addToList('additional_images')} className="admin-btn secondary" style={{padding: '6px 12px', fontSize: '0.8rem'}}>
                      <PlusCircle size={14} /> Add Image
                    </button>
                  </div>
                  {formData.additional_images.map((imgUrl, index) => (
                    <div key={index} className="dynamic-list-item">
                      <input 
                        type="url" 
                        className="admin-input" 
                        value={imgUrl} 
                        onChange={(e) => handleListChange('additional_images', index, e.target.value)} 
                        placeholder="https://... image URL"
                      />
                      <button type="button" onClick={() => removeFromList('additional_images', index)} className="btn-icon-only" style={{color: 'var(--admin-danger)'}}>
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  ))}
                  {formData.additional_images.length === 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No additional images. Click "Add Image" to include gallery images.</div>
                  )}
                </div>

                {/* Dynamic Benefits */}
                <div className="dynamic-list-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="admin-label" style={{marginBottom: 0}}>Key Benefits</label>
                    <button type="button" onClick={() => addToList('benefits')} className="admin-btn secondary" style={{padding: '6px 12px', fontSize: '0.8rem'}}>
                      <PlusCircle size={14} /> Add Benefit
                    </button>
                  </div>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="dynamic-list-item">
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={benefit} 
                        onChange={(e) => handleListChange('benefits', index, e.target.value)} 
                        placeholder="e.g. Promotes Digestive Wellness"
                      />
                      <button type="button" onClick={() => removeFromList('benefits', index)} className="btn-icon-only" style={{color: 'var(--admin-danger)'}}>
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Dynamic Sizes */}
                <div className="dynamic-list-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="admin-label" style={{marginBottom: 0}}>Size Variations</label>
                    <button type="button" onClick={addSize} className="admin-btn secondary" style={{padding: '6px 12px', fontSize: '0.8rem'}}>
                      <PlusCircle size={14} /> Add Size
                    </button>
                  </div>
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="dynamic-list-item" style={{flexDirection: 'column', gap: '8px'}}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-text-secondary)'}}>Variation {index + 1}</span>
                        <button type="button" onClick={() => removeSize(index)} className="btn-icon-only" style={{color: 'var(--admin-danger)', padding: 0}}>
                          <MinusCircle size={18} />
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                        <input type="text" className="admin-input" placeholder="Name (e.g. Starter Pack)" value={size.name} onChange={(e) => handleSizeChange(index, 'name', e.target.value)} />
                        <input type="text" className="admin-input" placeholder="Volume (e.g. 1000 ml x 1)" value={size.volume} onChange={(e) => handleSizeChange(index, 'volume', e.target.value)} />
                        <input type="number" step="0.01" className="admin-input" placeholder="Price (₹)" value={size.price} onChange={(e) => handleSizeChange(index, 'price', e.target.value)} />
                        <input type="number" step="0.01" className="admin-input" placeholder="Original Price (₹)" value={size.original_price} onChange={(e) => handleSizeChange(index, 'original_price', e.target.value)} />
                        <input type="text" className="admin-input" placeholder="Save Text (e.g. Save ₹20)" value={size.saveText} onChange={(e) => handleSizeChange(index, 'saveText', e.target.value)} style={{gridColumn: '1 / -1'}} />
                      </div>
                    </div>
                  ))}
                </div>

              </form>
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn secondary" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" form="productForm" className="admin-btn">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
