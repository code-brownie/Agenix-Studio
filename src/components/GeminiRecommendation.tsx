'use client'
import React, { useState } from 'react';
import { chatSession } from '@/utils/GeminiModel';
// import { Loader2, Search } from 'lucide-react';

const SiteRecommendationForm: React.FC = () => {
    const [inputWords, setInputWords] = useState('');
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const inputPrompt = `Keywords: ${inputWords}. Based on these keywords, provide recommendations for building a website using a website builder on our platform. The user does not need to code, and the recommendations should focus on leveraging the platform's features. The response should be in the following valid JSON format: \n\n{
            "recommendations": [
                {
                    "title": "Title of Recommendation",
                    "description": "Detailed description of the recommendation, tailored to the website builder's features."
                },
                ...
            ]
        }`;

        try {
            const result = await chatSession.sendMessage(inputPrompt);
            const rawResponse = result.response.text();
            const rawmResponse = rawResponse.replace('json', '').replace('', '');
            console.log(rawResponse)
            setJsonResponse(rawmResponse);
        } catch (error) {
            console.error('Error processing request:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseAndDisplayResponse = () => {
        try {
            const parsedResponse = JSON.parse(jsonResponse);
            return (
                <ul className="space-y-3 text-gray-700">
                    {parsedResponse.recommendations.map((rec: any, index: number) => (
                        <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">{rec.title}</h3>
                            <p className="text-sm">{rec.description}</p>
                        </li>
                    ))}
                </ul>
            );
        } catch (error) {
            return <p className="text-red-500 bg-red-50 p-3 rounded-md">Invalid JSON response format.</p>;
        }
    };

    return (
        <div className=" mx-auto p-6 bg-gray-700 min-h-screen">
            <div className="bg-gray-900 shadow-xl rounded-xl p-8">
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Website Builder Advisor</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="inputWords" className="block text-2xl font-medium text-gray-200 mb-2">
                            Enter Keywords or Themes
                        </label>
                        <div className="relative ">
                            <input
                                id="inputWords"
                                type="text"
                                value={inputWords}
                                onChange={(e) => setInputWords(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., tech blog, portfolio, online store"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                {/* <Loader2 className="mr-2 animate-spin" size={20} /> */}
                                Generating Recommendations...
                            </>
                        ) : (
                            'Get Recommendations'
                        )}
                    </button>
                </form>

                {jsonResponse && (
                    <div className="mt-8 space-y-4">
                        <h2 className="text-2xl font-semibold text-blue-800">Recommendations:</h2>
                        {parseAndDisplayResponse()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiteRecommendationForm;