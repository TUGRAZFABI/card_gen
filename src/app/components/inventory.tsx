'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getImageUrl, deleteInstance, updateUserCoins } from '../lib/utils';
import { CurrentUser, useUser } from '../lib/userContext';

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
  let [price, setPrice] = useState<string>('');

  const { userId, username, setUserId } = useUser();

  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = async () => {
    let currentUserId = userId;

    const { data: user } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', currentUserId)
      .single();

    if (user == null) {
      console.log('User not found!');
      setAllCards([]);
      return;
    }

    let mapOfAllCards = new Map<string, CardItem>();

    for (const instance of user.inventory) {
      const [className, templateID, idString] = instance.split(',');
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
    updatedInventory(cardToSell);
    updateUserCoins(userId, cardToSell.price);
    deleteInstance(cardToSell.id);
  };

  const sellOnMarket = async (cardToSell: CardItem) => {
    const currentUserId = userId;

    await supabase.from('marketplace').insert({
      seller_id: currentUserId,
      price: price,
      card_instance_id: cardToSell.id,
      seller_username: username,
      png_id: cardToSell.png_id,
      class: cardToSell.class,
    });
    updatedInventory(cardToSell);
    getInventory();
  };

  const updatedInventory = async (cardToSell: any) => {
    let indexToDelete = 0;
    const { data: user } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', userId)
      .single();
    for (let i = 0; i < user.inventory.length; i++) {
      const [className, tewmplateID, idString] = user.inventory[i].split(',');
      console.log('name and class', className, idString);

      if (className == cardToSell.class && idString == cardToSell.id) {
        const updatedInventory = [...user.inventory];
        updatedInventory.splice(indexToDelete, 1);

        await supabase
          .from('user_collection')
          .update({ inventory: updatedInventory })
          .eq('id', userId || 1);
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
                  console.log(card.png_id, card.class);
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

              <div className="mb-4">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="border rounded px-3 py-1.5 w-28"
                />
              </div>

              <button
                onClick={async () => {
                  await sellOnMarket(card);
                }}
                style={{
                  backgroundColor: '#6944efff',
                  color: 'white',
                  padding: '1px 3px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Sell on market
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
