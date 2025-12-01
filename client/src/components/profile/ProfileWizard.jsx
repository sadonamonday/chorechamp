import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PortfolioManager from './PortfolioManager';

const ProfileWizard = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: user?.bio || '',
        location: user?.location || '',
        phone: user?.phone || '',
        website: user?.website || '',
        avatar_url: user?.avatar_url || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = async () => {
        if (step === 1) {
            setLoading(true);
            const { success, message } = await updateUserProfile({
                bio: formData.bio,
                location: formData.location,
                phone: formData.phone,
                website: formData.website
            });
            setLoading(false);
            if (!success) {
                alert('Error updating profile: ' + message);
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleComplete = () => {
        navigate('/tasker/dashboard');
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please log in to complete your profile.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {i}
                                </div>
                                {i < 3 && <div className={`h-1 flex-1 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>Basic Info</span>
                        <span>Portfolio</span>
                        <span>Verification</span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tell clients about yourself..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="City, State"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website (Optional)</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {loading ? 'Saving...' : 'Next: Portfolio'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
                            <p className="text-gray-500">Add examples of your past work to attract more clients.</p>
                            <PortfolioManager />
                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Next: Verification
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Background Check</h2>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            To ensure safety in our community, all taskers must undergo a background check.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-4">
                                <h3 className="text-lg font-medium text-gray-900">Identity Verification</h3>
                                <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-gray-900">Pending</span></p>
                                <button
                                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => alert('Background check integration would start here.')}
                                >
                                    Start Background Check
                                </button>
                            </div>
                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleComplete}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                >
                                    Complete Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileWizard;
