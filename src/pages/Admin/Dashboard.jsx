import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', marginBottom: 0 }}>
    <div style={{ backgroundColor: color, padding: '16px', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${color}40` }}>
      <Icon size={28} />
    </div>
    <div>
      <h4 style={{ margin: '0 0 8px 0', color: 'var(--admin-text-secondary)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: 'var(--admin-text-primary)' }}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    ordersToday: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersData, productsData, ordersData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, total_amount, created_at')
      ]);

      const totalRevenue = ordersData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      const todayStr = new Date().toISOString().split('T')[0];
      const ordersTodayCount = ordersData.data?.filter(order => order.created_at.startsWith(todayStr)).length || 0;

      setStats({
        users: usersData.count || 0,
        products: productsData.count || 0,
        orders: ordersData.data?.length || 0,
        ordersToday: ordersTodayCount,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div>
      <div className="admin-header-actions">
        <div>
          <h1 className="admin-title">Dashboard Overview</h1>
          <p style={{color: 'var(--admin-text-secondary)', marginTop: '8px'}}>Here's what's happening with your store today.</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatCard title="Total Users" value={stats.users} icon={Users} color="#2d5a27" />
        <StatCard title="Total Products" value={stats.products} icon={Package} color="#3a7233" />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} color="#e67e22" />
        <StatCard title="Orders Today" value={stats.ordersToday} icon={ShoppingCart} color="#d35400" />
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toFixed(2)}`} icon={DollarSign} color="#1a1a1a" />
      </div>

      <div className="admin-card">
        <h3 style={{margin: '0 0 16px 0', fontSize: '1.25rem', color: 'var(--admin-text-primary)'}}>Welcome to your Premium Admin Panel</h3>
        <p style={{ color: 'var(--admin-text-secondary)', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>
          Use the sidebar to navigate through the different sections of your store. 
          You can manage your products, add dynamic benefits and size variations, and view comprehensive customer orders.
          All changes reflect immediately on the main website.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
