"use client"
import { 
  LayoutDashboard, Package, ShoppingCart, Users, CreditCard, 
  Truck, Tag, Settings, MessageSquare, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
export const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
return(
    <div className="w-1/4 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-8 h-8" />
          ShopAdmin
        </h1>
      </div>
      <nav className="p-4">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'productes', icon: Package, label: 'Productes' },
          { id: 'orders', icon: ShoppingCart, label: 'Orders' },
          { id: 'customers', icon: Users, label: 'Customers' },
          { id: 'payments', icon: CreditCard, label: 'Payments' },
          { id: 'messages', icon: MessageSquare, label: 'Messages' },
          { id: 'team', icon: Tag, label: 'Team' },
        ].map(item => (
          <Link
            key={item.id}
            href={`/admin/${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>)
  }
