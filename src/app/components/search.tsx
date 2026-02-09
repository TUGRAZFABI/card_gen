'use client'

import {useEffect, useState, useRef} from 'react';
import {supabase} from '../lib/supabase'
import getImageUrl from '../lib/utils'

export default function SearchCard()
{
    const [userInput, setUserInput] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const [selectedCard, setSelectedCard] = useState<any>();

    const autoFill = async () => 
    {
        const  {data: magicCards} = await supabase.from("MTG").select('*').ilike('name', `%${userInput}%`).limit(3);
        const  {data: pokemonCards} = await supabase.from("POKEMON").select('*').ilike('name', `%${userInput}%`).limit(3);
        const magicWithType = (magicCards || []).map(card => ({ ...card, type: 'mtg' }));
        const pokemonWithType = (pokemonCards || []).map(card => ({ ...card, type: 'pokemon' }));
        
        const similarCards = [...magicWithType, ...pokemonWithType];
        setResults(similarCards || [])
    }

    useEffect(() => {
        autoFill();
    }, [userInput]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setResults([]);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div>
            <div className="relative" ref={searchRef}>
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
                                        setSelectedCard(card);
                                        setUserInput(card.name); 
                                        setResults([]); 
                                        console.log(card.png_id);
                                    }}
                                >
                                    <div className="font-medium">{card.name}</div>
                                    <div className="text-sm text-gray-500">{card.class}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedCard && (
                    <div className="mt-4">
                        <img
                            src={getImageUrl(selectedCard.png_id, selectedCard.class)}
                            alt={selectedCard.name}
                            className="w-full h-auto rounded"
                        />
                        <p className="mt-2 text-center font-medium">{selectedCard.name}</p>
                    </div>
            )}
            </div> 

            
        </div>
    )
}