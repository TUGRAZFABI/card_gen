'use client'

import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase'
import getImageUrl from '../lib/utils'

interface CardItem {
  id: string
  template_id: number
  class: string
  name: string
  png_id?: string
  quantity: number
}


export default function Inventory()
{
    const [imageUrl, setImageUrl] = useState<string>();
    const [allCards, setAllCards] = useState<CardItem[]>([]);

    useEffect(() => {
        getInventory()
    }, [])

    const getInventory = async() => 
    {
      let mockUserID = 1
      
      const { data: instances } = await supabase
        .from('card_instance')
        .select('*')
        .eq('owner_id', mockUserID)

        if(instances == null)
        {
            setAllCards([]);
            return;
        }

        let mapOfAllCards = new Map<string, CardItem>();

        for (const instance of instances )
        {
            const key = `${instance.class}_${instance.template_id}`

            if(mapOfAllCards.has(key))
            {
                const existing = mapOfAllCards.get(key)!;
                existing.quantity += 1;
            }
            else
            {
                const { data: imageURL } = await supabase
                    .from(instance.class)
                    .select('*')
                    .eq('id', instance.template_id).single();
                mapOfAllCards.set(key, {
                    id: instance.id,
                    template_id: instance.template_id,
                    class: instance.class,
                    name: imageURL.name,
                    png_id : imageURL.png_id,
                    quantity: 1
                    
                }) 
            }
    }

        const cardArray = Array.from(mapOfAllCards.values());
        setAllCards(cardArray);
    }


    

    return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Your Cards ({allCards.length})</h1>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allCards.map((card) => (
        <div key={card.id} className="bg-white rounded-lg shadow p-2">
            {card.png_id ? (
            <img
                src={getImageUrl(card.png_id, card.class)}
                alt={card.name}
                className="w-full h-auto rounded"
            />
            ) : (
            <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                No Image
            </div>
            )}
            
            <div className="mt-2 text-center">
            <p className="text-sm font-medium truncate">{card.name}</p>
            <p className="text-xs text-gray-500">
                {card.class} • {card.quantity}x
            </p>
            </div>
        </div>
        ))}
    </div>
    </div>
    )
}