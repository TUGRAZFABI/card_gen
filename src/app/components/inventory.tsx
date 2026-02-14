'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import getImageUrl from '../lib/utils';

interface CardItem {
  id: string;
  template_id: number;
  class: string;
  name: string;
  png_id?: string;
  quantity: number;
  price: number;
}

export default function Inventory() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [allCards, setAllCards] = useState<CardItem[]>([]);

  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = async () => {
    let mockUserID = 1;

    const { data: user } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', mockUserID)
      .single();

    if (user == null) {
      console.log('User not found!');
      setAllCards([]);
      return;
    }

    let mapOfAllCards = new Map<string, CardItem>();

    for (const instance of user.inventory) {
      const [className, idString] = instance.split(',');
      const templateId = parseInt(idString, 10);
      const key = `${className}_${idString}`;

      if (mapOfAllCards.has(key)) {
        const existing = mapOfAllCards.get(key)!;
        existing.quantity += 1;
      } else {
        const { data: imageURL } = await supabase
          .from(className)
          .select('*')
          .eq('id', idString)
          .single();
        mapOfAllCards.set(key, {
          id: idString,
          template_id: templateId,
          class: className,
          name: imageURL.name,
          png_id: imageURL.png_id,
          quantity: 1,
          price: imageURL.price,
        });
      }
    }

    const cardArray = Array.from(mapOfAllCards.values());
    setAllCards(cardArray);
  };

  const quickSell = async (cardToSell: CardItem) => {
    const mockUserID = 1;
    let { data: user } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', mockUserID)
      .single();
    await supabase
      .from('user_collection')
      .update({ coins: cardToSell.price + user?.coins })
      .eq('id', mockUserID);
    //await supabase.from('card_instance').update({in_inventory : false}).eq('id' , mockUserID).eq('template_id', singleCard.id);

    //fetch the whole inventory search entry to delete and update cell#
    let indexToDelete = 0;
    for (let i = 0; i < user.inventory.length; i++) {
      const [className, idString] = user.inventory[i].split(',');
      console.log('name and class', className, idString);

      if (className == cardToSell.class && idString == cardToSell.id) {
        const updatedInventory = [...user.inventory];
        updatedInventory.splice(indexToDelete, 1);

        await supabase
          .from('user_collection')
          .update({ inventory: updatedInventory })
          .eq('id', mockUserID);
        console.log('Final index to delete: ', indexToDelete);
        break;
      }
      console.log('index to delete: ', indexToDelete);

      indexToDelete++;
    }
    await getInventory();
  };

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
              <button
                onClick={async () => {
                  await quickSell(card);
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
