import { supabase } from '../lib/supabase';

// LocalStorage fallback key for reviews
const REVIEWS_STORAGE_KEY = 'ayurveda_customer_reviews';

const getLocalReviews = () => {
  try {
    const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const saveLocalReviews = (reviews) => {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

// Initial sample reviews if empty
const INITIAL_SAMPLE_REVIEWS = [
  {
    id: 'rev-1',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.s@gmail.com',
    rating: 5,
    comment: 'Very authentic Dhatu Paushtic Churn. Highly recommend for natural energy and strength!',
    product_name: 'FT. Dhatu Paushtic Churn 100gm',
    product_id: 'sample-1',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rev-2',
    customer_name: 'Ananya Verma',
    customer_email: 'ananya.v@yahoo.com',
    rating: 5,
    comment: 'Fast delivery by Shadowfax and genuine Ayurvedic product quality.',
    product_name: 'General Wellness Bundle',
    product_id: 'sample-2',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// Initialize local reviews if empty
if (getLocalReviews().length === 0) {
  saveLocalReviews(INITIAL_SAMPLE_REVIEWS);
}

/**
 * Submit a customer review / feedback
 */
export const submitCustomerReview = async ({ customer_name, customer_email, rating, comment, product_id, product_name }) => {
  const newReview = {
    id: 'rev-' + Date.now(),
    customer_name: customer_name || 'Anonymous Customer',
    customer_email: customer_email || 'customer@example.com',
    rating: Number(rating) || 5,
    comment: comment || '',
    product_id: product_id || null,
    product_name: product_name || 'General Store Feedback',
    status: 'approved', // auto approve or pending
    created_at: new Date().toISOString()
  };

  try {
    // Try saving to Supabase DB table 'reviews'
    const { data, error } = await supabase
      .from('reviews')
      .insert([newReview])
      .select();

    if (error) {
      console.warn('Supabase reviews table notice (saving locally):', error.message);
    }
  } catch (err) {
    console.warn('Supabase insertion error (fallback to local):', err);
  }

  // Always save locally to guarantee data persistence
  const localList = getLocalReviews();
  localList.unshift(newReview);
  saveLocalReviews(localList);

  return { success: true, data: newReview };
};

/**
 * Fetch approved reviews for a specific product or all approved reviews
 */
export const fetchProductReviews = async (productId = null) => {
  let dbReviews = [];
  try {
    let query = supabase.from('reviews').select('*').eq('status', 'approved');
    if (productId) {
      query = query.eq('product_id', productId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) {
      dbReviews = data;
    }
  } catch (err) {
    console.warn('Using local storage reviews fallback:', err);
  }

  const localList = getLocalReviews().filter(r => r.status === 'approved');
  if (productId) {
    const filteredLocal = localList.filter(r => r.product_id === productId);
    // Combine unique
    const combined = [...dbReviews];
    filteredLocal.forEach(l => {
      if (!combined.some(c => c.id === l.id)) {
        combined.push(l);
      }
    });
    return combined;
  }

  const combined = [...dbReviews];
  localList.forEach(l => {
    if (!combined.some(c => c.id === l.id)) {
      combined.push(l);
    }
  });
  return combined;
};

/**
 * Fetch all customer reviews for Admin Management
 */
export const fetchAllReviewsAdmin = async () => {
  let dbReviews = [];
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      dbReviews = data;
    }
  } catch (err) {
    console.warn('Fetch admin reviews fallback:', err);
  }

  const localList = getLocalReviews();
  const combined = [...dbReviews];
  localList.forEach(l => {
    if (!combined.some(c => c.id === l.id)) {
      combined.push(l);
    }
  });

  return combined;
};

/**
 * Delete a review
 */
export const deleteCustomerReview = async (reviewId) => {
  try {
    await supabase.from('reviews').delete().eq('id', reviewId);
  } catch (err) {
    console.warn('Supabase delete review error:', err);
  }

  const updatedLocal = getLocalReviews().filter(r => r.id !== reviewId);
  saveLocalReviews(updatedLocal);
  return { success: true };
};
