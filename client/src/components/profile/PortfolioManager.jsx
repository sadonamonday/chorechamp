import React, { useState, useEffect } from 'react';
import supabase from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const PortfolioManager = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ title: '', description: '', image_url: '' });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchPortfolio();
    }, [user]);

    const fetchPortfolio = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolios')
                .select('*')
                .eq('tasker_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('portfolios')
                .insert([{ ...newItem, tasker_id: user.id }])
                .select();

            if (error) throw error;

            setItems([data[0], ...items]);
            setNewItem({ title: '', description: '', image_url: '' });
            setAdding(false);
        } catch (error) {
            console.error('Error adding portfolio item:', error);
            alert('Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const { error } = await supabase
                .from('portfolios')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    if (loading) return <div>Loading portfolio...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Your Work</h3>
                <button
                    onClick={() => setAdding(!adding)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                >
                    {adding ? 'Cancel' : '+ Add New Project'}
                </button>
            </div>

            {adding && (
                <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-md space-y-3">
                    <input
                        type="text"
                        placeholder="Project Title"
                        className="w-full border rounded px-3 py-2"
                        value={newItem.title}
                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full border rounded px-3 py-2"
                        value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="Image URL (Optional)"
                        className="w-full border rounded px-3 py-2"
                        value={newItem.image_url}
                        onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                        Save Item
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
                        {item.image_url && (
                            <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover" />
                        )}
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
                {items.length === 0 && !adding && (
                    <p className="text-gray-500 text-sm italic col-span-2 text-center py-4">
                        No portfolio items yet. Add one to showcase your skills!
                    </p>
                )}
            </div>
        </div>
    );
};

export default PortfolioManager;
