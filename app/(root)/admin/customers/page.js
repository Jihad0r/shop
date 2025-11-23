"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { User, ShoppingCart, Calendar, TrendingUp, Package, X, Search, Loader2, Edit2, Trash2, Save ,Ban,TimerOff} from "lucide-react";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [userCarts, setUserCarts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ state: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // === Fetch all users and carts ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/user");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);

        // Fetch all carts for users
        const cartPromises = data.map((user) =>
          fetch(`/api/carts/${user._id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((cartData) => ({
              userId: user._id,
              items: cartData?.items || [],
            }))
            .catch(() => ({
              userId: user._id,
              items: [],
            }))
        );

        const carts = await Promise.all(cartPromises);
        const formatted = carts.reduce((acc, { userId, items }) => {
          acc[userId] = items;
          return acc;
        }, {});
        setUserCarts(formatted);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // === Helper functions ===
  const calcTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const calcCount = (items) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusColor = (state) => {
    const stateLower = state?.toLowerCase();
    if (stateLower === 'active') return 'bg-emerald-100 text-emerald-700';
    if (stateLower === 'blocked') return 'bg-red-100 text-red-700';
    if (stateLower === 'discontinue') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-600';
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === Handle Edit ===
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      state: selectedUser.state
    });
  };

  // === Handle Update ===
  const handleUpdate = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser._id,
          state: editForm.state
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      // Update local state
      setUsers(users.map(u => 
        u._id === selectedUser._id 
          ? { ...u, state: editForm.state }
          : u
      ));
      
      setSelectedUser({ ...selectedUser, state: editForm.state });
      setIsEditing(false);
      toast.success('User updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // === Handle Delete ===
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedUser.username}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      // Update local state
      setUsers(users.filter(u => u._id !== selectedUser._id));
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // === Render ===
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
        <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-400 mb-2">
          No users yet
        </h3>
        <p className="text-gray-400">Get started by adding your first users</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Overview</h1>
          <p className="text-gray-600">Monitor customer activity and purchase history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Customers</span>
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active Users</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.state?.toLowerCase() === 'active').length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Discontinue Users</span>
              <TimerOff className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.state?.toLowerCase() === 'discontinue').length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Blocked Users</span>
              <Ban className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.state?.toLowerCase() === 'blocked').length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Orders</span>
              <ShoppingCart className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Object.values(userCarts).reduce((sum, cart) => sum + calcCount(cart), 0)}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="text-left py-4 px-6 font-semibold">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 font-semibold">Total Spending</th>
                  <th className="text-left py-4 px-6 font-semibold">Products</th>
                  <th className="text-left py-4 px-6 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const userCart = userCarts[user._id] || [];
                  const totalSpending = calcTotal(userCart);
                  const totalProducts = calcCount(userCart);
                  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const initials = user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                  return (
                    <tr
                      key={user._id}
                      onClick={() => {
                        setSelectedUser({ ...user, cart: userCart });
                        setIsEditing(false);
                      }}
                      className={`border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.state)}`}>
                          {user.state}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900">${totalSpending}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-700">{totalProducts}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{joinedDate}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setIsEditing(false);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUser.username}</h3>
                    <div className="flex gap-2 mt-2">
                      {isEditing ? (
                          <select
                            value={editForm.state}
                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                            className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white border border-white/30"
                          >
                            <option value="active" className="text-gray-900">Active</option>
                            <option value="blocked" className="text-gray-900">Blocked</option>
                            <option value="discontinue" className="text-gray-900">Discontinue</option>
                          </select>
                      ) : (
                          <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                            {selectedUser.state}
                          </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  {isEditing ? (
                    <>
                      <button
                        onClick={()=>handleUpdate(selectedUser._id)}
                        disabled={actionLoading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit User
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={actionLoading}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete User
                      </button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${calcTotal(selectedUser.cart)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm text-gray-600 mb-1">Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {calcCount(selectedUser.cart)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedUser.cart.length}
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order History
                </h4>
                
                {selectedUser.cart.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.cart.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.product.title}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">${item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found for this customer</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}