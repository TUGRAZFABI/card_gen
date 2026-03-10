'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getImageUrl, deleteInstance, updateUserCoins } from '../lib/utils';
import { CurrentUser, useUser } from '../lib/userContext';

interface CardItem {
  id: string;
  price: number;
  instance_id: number;
}

export default function Marketplace() {
  const { userId, username, setUserId } = useUser();
  const [idDeleteInstance, setIdDeleteInstance] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<number>(0);

  useEffect(() => {
    getMarket();
  }, []);

  const getMarket = async () => {
    const { data: MarketData } = await supabase
      .from('marketplace')
      .select('*')
      .order('created_at', { ascending: true });
    let mapOfAllCards = new Map<string, CardItem>();

    for (const instance of MarketData || []) {
      mapOfAllCards.set(instance.username, {
        id: instance.id,
        price: instance.price,
        instance_id: instance.instance_id,
      });
    }
  };

  const buyCard = async () => {
    deleteInstance(idDeleteInstance);
    updateUserCoins(userId, buyPrice);
  };

  return <div></div>;
}
