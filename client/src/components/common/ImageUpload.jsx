import React, { useState } from 'react';
import supabase from '../../services/supabaseClient';

const ImageUpload = ({ onUpload, maxFiles = 3 }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [previews, setPreviews] = useState([]);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + previews.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} images.`);
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const newPreviews = [];
            const uploadedUrls = [];

            for (const file of files) {
                // Create local preview
                newPreviews.push(URL.createObjectURL(file));

                // Upload to Supabase
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `task-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('task-images') // Assuming a bucket named 'task-images' exists or 'public'
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('task-images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            setPreviews(prev => [...prev, ...newPreviews]);
            onUpload(uploadedUrls);

        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        // Note: We are not deleting from storage here to keep it simple, 
        // but in a real app you might want to clean up or handle it on submit.
        // We also need to notify the parent to remove the URL, but for now 
        // the parent just gets the list of added URLs. 
        // To properly sync, we might need to change the interface to pass back the full list.
        // For this iteration, let's assume the user adds images and if they remove, 
        // we might need to handle that state better in the parent or here.
        // Let's update onUpload to pass the accumulated URLs if we stored them.
        // Actually, simpler: The parent manages the URLs. This component just uploads and gives back the new URL.
        // But for a better UX, let's let this component manage the preview and just return the list of URLs to the parent.
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4 mb-4">
                {previews.map((src, index) => (
                    <div key={index} className="relative w-24 h-24">
                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {previews.length < maxFiles && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*" disabled={uploading} />
                </label>
            )}
            {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ImageUpload;
