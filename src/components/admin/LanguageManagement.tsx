import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ProgrammingLanguage, NewProgrammingLanguage } from '../../types';

const LanguageManagement: React.FC = () => {
    const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
    const [newLanguage, setNewLanguage] = useState<NewProgrammingLanguage>({ name: '', code: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const data = await api.getLanguages();
            setLanguages(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch languages');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createLanguage(newLanguage);
            setNewLanguage({ name: '', code: '' });
            fetchLanguages();
        } catch (err) {
            setError('Failed to create language');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteLanguage(id);
            setDeleteConfirm(null);
            fetchLanguages();
        } catch (err) {
            setError('Failed to delete language');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Language Management</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Language Name"
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Language Code"
                        value={newLanguage.code}
                        onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Add Language
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {languages.map((language) => (
                            <tr key={language.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{language.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{language.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{language.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {deleteConfirm === language.id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Are you sure?</span>
                                            <button
                                                onClick={() => handleDelete(language.id)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="text-gray-600 hover:text-gray-900 font-medium"
                                            >
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(language.id)}
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LanguageManagement; 