'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  getImageUrl,
  deleteInstance,
  updateUserCoins,
  removeFromMarketAndChangeOwnership,
} from '../lib/utils';
import { CurrentUser, useUser } from '../lib/userContext';

interface CardItem {
  id: string;
  price: number;
  instance_id: number;
  png_id?: string;
  class: string;
  seller_username: string;
}

export default function Marketplace() {
  const { userId, username, setUserId } = useUser();
  const [idDeleteInstance, setIdDeleteInstance] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [allCards, setAllCards] = useState<CardItem[]>([]);

  useEffect(() => {
    getMarket();
  }, []);

  const getMarket = async () => {
    const { data: MarketData } = await supabase
      .from('marketplace')
      .select('*')
      .order('created_at', { ascending: true });

    const cardArray: CardItem[] =
      MarketData?.map((instance) => ({
        id: instance.id,
        price: instance.price,
        instance_id: instance.card_instance_id,
        png_id: instance.png_id,
        class: instance.class,
        username: instance.username,
        created_at: instance.created_at,
        seller_username: instance.seller_username,
      })) || [];
    setAllCards(cardArray);
  };

  const buyCard = async (card: CardItem) => {
    await updateUserCoins(userId, card.price);
    await removeFromMarketAndChangeOwnership(card, userId);
    await getMarket();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace ({allCards.length})</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow p-2">
            {card.png_id ? (
              <img src={getImageUrl(card.png_id, card.class)} className="w-full h-auto rounded" />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <div className="mt-2 text-center">
              <p className="text-sm font-medium truncate">{card.seller_username}</p>
              <button
                onClick={async () => {
                  await buyCard(card);
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
                Buy card : {card.price}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
