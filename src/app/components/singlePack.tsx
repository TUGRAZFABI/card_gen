'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { strict } from 'assert';
import { getImageUrl, updateUserCoins } from '../lib/utils';
import { CurrentUser, useUser } from '../lib/userContext';

async function createCardInstance(id: any, owner_id: number, class_type: string) {
  const { data: data } = await supabase
    .from('card_instance')
    .insert({
      template_id: id,
      owner_id: owner_id,
      class: class_type,
    })
    .select();
  if (data == null) {
    return;
  }
  return data[0].id;
}

export default function SinglePack() {
  const [isOpened, setterIsOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [cardPrice, setCardPrice] = useState<number>(0);
  const [cardId, setCardId] = useState<number>(0);
  const [currentTypetoOpen, setcurrentTypetoOpen] = useState<string>('MTG');

  const [coins, setCoins] = useState<number>(0);

  const { userId, username, setUserId } = useUser();

  const rarityDict = {
    Common: 50,
    Uncommon: 80,
    Rare: 100,
  };

  const openPack = async () => {
    const mockPriceOfPack = 10;

    const { data: userData } = await supabase
      .from('user_collection')
      .select('*')
      .eq('id', userId)
      .single();

    if (userData.coins <= 0) {
      console.log('NO CONIS LEFT!!!');
      return;
    }

    const rarityTypeNumber = Math.floor(Math.random() * 100) + 1;
    let rarityString = 'Common';

    for (const [word, number] of Object.entries(rarityDict)) {
      if (rarityTypeNumber <= number) {
        rarityString = word;
        break;
      }
    }

    const { data: allCardsWithRarity } = await supabase
      .from(currentTypetoOpen)
      .select('*')
      .eq('rarity', rarityString)
      .not('png_id', 'is', null);

    if (!allCardsWithRarity || allCardsWithRarity.length === 0) {
      console.error('No cards found for rarity:', rarityString);
      return;
    }

    const randomIndex = Math.floor(Math.random() * allCardsWithRarity.length);

    const { data } = await supabase
      .from(currentTypetoOpen)
      .select('*')
      .eq('id', allCardsWithRarity[randomIndex].id)
      .single();

    setCardId(data.id);

    updateUserCoins(userData.id, mockPriceOfPack);
    setImageUrl(getImageUrl(data.png_id, currentTypetoOpen));
    setterIsOpened(true);
  };

  const addToInventory = async () => {
    const templateID = await createCardInstance(cardId, userId, currentTypetoOpen);

    const { data: user } = await supabase
      .from('user_collection')
      .select('inventory')
      .eq('id', userId)
      .single();
    const newItem = currentTypetoOpen + ',' + templateID + ',' + cardId;
    console.log(newItem);
    const newArray = [...user?.inventory, newItem];
    const onError = await supabase
      .from('user_collection')
      .update({ inventory: newArray })
      .eq('id', userId)
      .single();

    setterIsOpened(false);
  };

  const quickSell = async () => {
    const onError = await supabase
      .from('user_collection')
      .update({ coins: coins + cardPrice })
      .eq('id', userId);
    setterIsOpened(false);
  };

  if (!isOpened) {
    return (
      <div className="container">
        <select
          value={currentTypetoOpen}
          onChange={(e) => setcurrentTypetoOpen(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '20px',
            minWidth: '200px',
          }}
        >
          <option value="MTG">Magic: The Gathering</option>
          <option value="POKEMON">Pokémon TCG</option>
        </select>

        <img
          src={getImageUrl('0000', currentTypetoOpen)}
          onClick={openPack}
          style={{
            width: '250px',
            height: '350px',
          }}
        ></img>

        <button
          onClick={openPack}
          style={{
            flex: 1,
            padding: '8px 0',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            justifyContent: 'center',
            textAlign: 'center',
            width: '250px',
          }}
        >
          Open Pack
        </button>
      </div>
    );
  } else if (isOpened) {
    return (
      <div className="container">
        <img
          src={imageUrl}
          onClick={addToInventory}
          style={{
            width: '250px',
            height: '350px',
          }}
        ></img>

        <div
          style={{
            display: 'flex',
            width: '250px',
            gap: '5px',
            marginTop: '10px',
          }}
        >
          <button
            onClick={addToInventory}
            style={{
              flex: 1,
              padding: '8px 0',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Move to inventory
          </button>

          <button
            onClick={quickSell}
            style={{
              flex: 1,
              padding: '8px 0',
              backgroundColor: '#af4c4cff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Quicksell for: {cardPrice}
          </button>
        </div>
      </div>
    );
  }
}
