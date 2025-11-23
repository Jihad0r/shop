"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { User, ShoppingCart, Calendar, TrendingUp, Package, X, Search, Loader2, Edit2, Trash2, Save, Tag } from "lucide-react";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ role: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // === Fetch all users ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/admin");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === 'admin') return 'bg-purple-100 text-purple-700';
    if (roleLower === 'editor') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === Handle Edit ===
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      role: selectedUser.role,
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
          role: editForm.role,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      // Update local state
      setUsers(users.map(u =>
        u._id === selectedUser._id
          ? { ...u, role: editForm.role }
          : u
      ));

      setSelectedUser({ ...selectedUser, role: editForm.role });
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

  // === Handle Card Click ===
  const handleCardClick = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">Error</div>
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <>
          {/* Search Bar - Fixed outside grid */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-500">
                Found {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
              </p>
            )}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search term' : 'Get started by adding your first users'}
              </p>
            </div>
          ) : (
            /* Users Grid - Using filteredUsers */
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <li
                  key={user._id || index}
                  onClick={() => handleCardClick(user)}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors flex-1">
                        {user.username}
                      </h2>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {user.state || 'No state'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                        Click to view details →
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setIsEditing(false);
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close modal"
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
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white border border-white/30 cursor-pointer"
                      >
                        <option value="user" className="text-gray-900">User</option>
                        <option value="admin" className="text-gray-900">Admin</option>
                        <option value="editor" className="text-gray-900">Editor</option>
                      </select>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                        {selectedUser.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* User Details */}
              <div className="mb-6 bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">User Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">State:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedUser.state || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User ID:</span>
                    <span className="text-sm font-mono text-gray-900">{selectedUser._id}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleUpdate(selectedUser._id)}
                      disabled={actionLoading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit User
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}