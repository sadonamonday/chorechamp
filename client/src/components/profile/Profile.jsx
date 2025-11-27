import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../services/supabaseClient';

const Profile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        phone: '',
        skills: '',
        hourly_rate: '',
        availability: ''
    });
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
            fetchReviews();
        }
    }, [user?.id]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setProfile(data);
            setFormData({
                bio: data.bio || '',
                phone: data.phone || '', // Note: Phone is not in schema.sql, might need to add it or ignore
                skills: data.skills || '', // Note: Skills is not in schema.sql
                hourly_rate: data.hourly_rate || '', // Note: hourly_rate is not in schema.sql
                availability: data.availability || '' // Note: availability is not in schema.sql
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, reviewer:profiles!reviewer_id(full_name)')
                .eq('reviewee_id', user.id);

            if (error) throw error;

            // Map reviewer name
            const mappedReviews = data.map(r => ({
                ...r,
                reviewer_name: r.reviewer?.full_name || 'Anonymous'
            }));

            setReviews(mappedReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    bio: formData.bio,
                    // phone: formData.phone, // Add to schema if needed
                    // skills: formData.skills,
                    // hourly_rate: formData.hourly_rate,
                    // availability: formData.availability
                })
                .eq('id', user.id);

            if (error) throw error;

            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{user.username}'s Profile</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Skills</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Hourly Rate (R)</label>
                            <input
                                type="number"
                                name="hourly_rate"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Availability</label>
                            <select
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Availability</option>
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="weekends">Weekends Only</option>
                                <option value="flexible">Flexible</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Bio</h3>
                            <p className="text-gray-600">{profile.bio || 'No bio added yet'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Contact</h3>
                            <p className="text-gray-600">{profile.phone || 'No phone number added'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Skills</h3>
                            <p className="text-gray-600">{profile.skills || 'No skills listed'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Hourly Rate</h3>
                            <p className="text-gray-600">
                                {profile.hourly_rate ? `R${profile.hourly_rate}/hr` : 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Availability</h3>
                            <p className="text-gray-600">
                                {profile.availability ? profile.availability.charAt(0).toUpperCase() +
                                    profile.availability.slice(1) : 'Not specified'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews yet</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="font-medium">{review.reviewer_name}</span>
                                        <span className="text-gray-400 mx-2">•</span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
