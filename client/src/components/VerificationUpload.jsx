import React, { useState } from 'react';
import supabase from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const VerificationUpload = ({ onVerificationSubmitted }) => {
    const { user } = useAuth();
    const [files, setFiles] = useState({
        id_front: null,
        id_back: null,
        selfie: null
    });
    const [previews, setPreviews] = useState({
        id_front: null,
        id_back: null,
        selfie: null
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
            setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
        }
    };

    const uploadFile = async (file, path) => {
        const { data, error } = await supabase.storage
            .from('verification-docs')
            .upload(path, file);

        if (error) throw error;
        return data.path;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setUploading(true);

        try {
            if (!files.id_front || !files.id_back || !files.selfie) {
                throw new Error('Please upload all required documents.');
            }

            // 1. Create Verification Record
            const { data: verification, error: verificationError } = await supabase
                .from('verifications')
                .insert([{ user_id: user.id, status: 'pending' }])
                .select()
                .single();

            if (verificationError) throw verificationError;

            // 2. Upload Files and Create Document Records
            const uploadPromises = Object.entries(files).map(async ([type, file]) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${verification.id}/${type}.${fileExt}`;
                const filePath = await uploadFile(file, fileName);

                return supabase
                    .from('verification_documents')
                    .insert([{
                        user_id: user.id,
                        verification_id: verification.id,
                        document_type: type,
                        document_file: filePath,
                        status: 'pending'
                    }]);
            });

            await Promise.all(uploadPromises);

            if (onVerificationSubmitted) {
                onVerificationSubmitted();
            }

        } catch (err) {
            console.error('Verification upload error:', err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="verification-upload-container p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
            <p className="mb-6 text-gray-600">To ensure the safety of our community, please upload your ID and a selfie.</p>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ID Front */}
                    <div className="file-input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Front</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                            {previews.id_front ? (
                                <img src={previews.id_front} alt="ID Front Preview" className="max-h-40 mx-auto mb-2 rounded" />
                            ) : (
                                <div className="text-gray-400 mb-2">No file selected</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'id_front')}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* ID Back */}
                    <div className="file-input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Back</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                            {previews.id_back ? (
                                <img src={previews.id_back} alt="ID Back Preview" className="max-h-40 mx-auto mb-2 rounded" />
                            ) : (
                                <div className="text-gray-400 mb-2">No file selected</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'id_back')}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* Selfie */}
                    <div className="file-input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selfie</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                            {previews.selfie ? (
                                <img src={previews.selfie} alt="Selfie Preview" className="max-h-40 mx-auto mb-2 rounded" />
                            ) : (
                                <div className="text-gray-400 mb-2">No file selected</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'selfie')}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`px-6 py-2 rounded-md text-white font-semibold ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {uploading ? 'Submitting...' : 'Submit Verification'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerificationUpload;
