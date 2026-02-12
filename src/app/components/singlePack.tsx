'use client'

import {useState} from 'react';
import {supabase} from '../lib/supabase'
import { strict } from 'assert';
import getImageUrl from '../lib/utils';

async function createCardInstance(id : any, owner_id : number, class_type: string)
{
    const onError = await supabase.from('card_instance').insert(
        {
            template_id : id,
            owner_id : owner_id,
            class : class_type
        }
    ).select().single();
}


export default function SinglePack()
{
  const [isOpened, setterIsOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [cardPrice, setCardPrice] = useState<number>(0);
  const [cardId, setCardId] = useState<number>(0);
  const [currentTypetoOpen, setcurrentTypetoOpen] = useState<string>("MTG");
  
  const [coins, setCoins] = useState<number>(0);

  const rarityDict = 
    { 
        "Common": 50, "Uncommon" : 80, "Rare" : 100,
    }
  


  const openPack = async () => {
    const mockUserID = 1;
    const mockPriceOfPack = 10;


    const {data : userData} = await supabase.from('user_collection').select('coins').eq('id', mockUserID).single();
    

    const currentCoins = userData?.coins || 0;
    const updatedCoins = currentCoins - mockPriceOfPack;
    if(updatedCoins <= 0)
    {
        //some pupup when time; 
        console.log("NO CONIS LEFT!!!")
        return;
    }

    setCoins(updatedCoins);

    const rarityTypeNumber = Math.floor(Math.random() * 100) + 1;
    let rarityString = 'Common';

    console.log("Das istr die rarity : " , rarityTypeNumber);

    for(const [word,number] of Object.entries(rarityDict))
    {
        if(rarityTypeNumber <= number)
        {
           rarityString = word;
           break;
        }   
    }

    console.log("Das istr die rarity : " , rarityString);


    const  {data: allCardsWithRarity} = await supabase.from(currentTypetoOpen).select('*').eq('rarity', rarityString).not('png_id', 'is', null);

    if(!allCardsWithRarity || allCardsWithRarity.length === 0) {
    console.error("No cards found for rarity:", rarityString);
    return;
  }

    const randomIndex = Math.floor(Math.random() * allCardsWithRarity.length)
    console.log("random number", randomIndex);

    const  {data} = await supabase.from(currentTypetoOpen).select('*').eq('id', allCardsWithRarity[randomIndex].id).single();
  
    setCardPrice(mockPriceOfPack);
    setCardId(data.id);
    
    
    const onError = await supabase.from('user_collection').update({coins: updatedCoins}).eq('id' , mockUserID)

    setImageUrl(getImageUrl(data.png_id, currentTypetoOpen));
    setterIsOpened(true);
  }

  const addToInventory = async () => {
      const mockUserID = 1;

      createCardInstance(cardId, mockUserID, currentTypetoOpen);

      const {data : user} = await supabase.from('user_collection').select('inventory').eq('id', mockUserID).single();
      const newItem = currentTypetoOpen + ',' + cardId;
      console.log(newItem);
      const newArray =[... user?.inventory, newItem];
      const onError = await supabase.from('user_collection').update({inventory: newArray}).eq('id', mockUserID).single();

      setterIsOpened(false);
  }

  const quickSell = async () => {
    const mockUserID = 1;    
    const onError = await supabase.from('user_collection').update({coins: coins + cardPrice}).eq('id' , mockUserID)
    setterIsOpened(false);
  
}

  if(!isOpened)
  {
    return(
        <div className='container'>

            <select
                value={currentTypetoOpen}
                onChange={(e) => setcurrentTypetoOpen(e.target.value)}
                style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '16px',
                marginBottom: '20px',
                minWidth: '200px'
                }}
            >
                <option value="MTG">Magic: The Gathering</option>
                <option value="POKEMON">Pokémon TCG</option>
                <option value="YUGIO">Yu-Gi-Oh!</option>
                <option value="FLESH">Flesh and Blood</option>
            </select>
           
            
            <img
            src={getImageUrl("0000",currentTypetoOpen)}
            onClick={openPack}
            style={{
                width: '250px',      
                height: '350px',   
            }}
            >
            </img>

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
                width : '250px',
                }}
            >
               Open Pack
            </button>

        </div>
    )
  }
  else if(isOpened)
  {
    return(
        <div className='container'>
            <img
            src={imageUrl}
            onClick={addToInventory}
            style={{
                width: '250px',      
                height: '350px',    
            }}
            >
            </img>

            <div style={{
            display: 'flex',
            width: '250px', 
            gap: '5px', 
            marginTop: '10px'
            }}>
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
    )
  }
}

