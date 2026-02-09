'use client'

import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase'
import getImageUrl from '../lib/utils'

export default function SearchCard()
{
    const [userInput, setUserInput] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);


    const autoFill = async () => 
    {
        console.log(userInput);
        const  {data: similarCards} = await supabase.from("MTG").select('name').ilike('name', `%${userInput}%`).limit(3);
        console.log(similarCards);
        setResults(similarCards || [])
    }

    //call the autofill every time i add a letter
    useEffect(() => {
        autoFill();
    }, [userInput]);

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search cards..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                        {results.map((card, index) => (
                            <div 
                                key={index}
                                className="p-2 hover:bg-gray-50 cursor-pointer rounded"
                                onClick={() => {
                                    setUserInput(card.name); // Fill input with selected card
                                    setResults([]); // Clear dropdown
                                }}
                            >
                                <div className="font-medium">{card.name}</div>
                                <div className="text-sm text-gray-500">MTG Card</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}