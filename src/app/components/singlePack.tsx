'use client'

import {useState} from 'react';
import {supabase} from '../lib/supabase'
import { stringify } from 'querystring';
import { isModuleNamespaceObject } from 'util/types';


interface entry
{
    id:number;
    name: string;
    class: string;
    max_amount : number;
    rarity : string;
    png_id : string;
}


function getImageUrl(png_id : string,type : string)
{
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    return `${supabaseUrl}/storage/v1/object/public/all_cards/${type}/${png_id}.png`;
}


export default function SinglePack()
{
  const [isOpened, setterIsOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [CardID, setCardID] = useState<number>(0);
  const [CardDataJson, setCardDataJson] = useState<any>();


  const openPack = async () => {
    const mockUserID = 1;
    const randomCardID = 1;
    const mockPriceOfPack = 10;

    const {data : userData} = await supabase.from('user_collection').select('coins').eq('id', mockUserID).single();
    const currentCoins = userData?.coins || 0;
    const updatedCoins = currentCoins - mockPriceOfPack;

    if(updatedCoins <= 0)
    {
        //some pupup when time; 
        return;
    }

    const  data = await supabase.from('card_template').select('*').eq('id', randomCardID).single();
    
    console.log(data);
    const card = data.data as entry;

    const onError = await supabase.from('user_collection').update({coins: updatedCoins}).eq('id' , mockUserID)


    setImageUrl(getImageUrl(card.png_id, card.class));
    setCardDataJson(data.data);
    setCardID(randomCardID);
    setterIsOpened(true);
  }

  const addToInventory = async () => {
      const mockUserID = 1;
      const onError = await supabase.from('user_collection').update({inventory: CardDataJson}).eq('id' , mockUserID)
  }

  if(!isOpened)
  {
    return(
        <div className='container'>
            <img
            src={getImageUrl("0000","MTG")}
            onClick={openPack}
            style={{
                width: '200px',      
                height: '300px',   
            }}
            >
            </img>

        </div>
    )
  }
  else if(isOpened)
  {
    return(
        <div className='container'>
            <img
            src={imageUrl}
            onClick={openPack}
            style={{
                width: '200px',      
                height: '300px',   
            }}
            >
            </img>

            <div style={{
            display: 'flex',
            width: '200px', 
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
                fontSize: '12px' 
                }}
            >
               Move to inventory
            </button>

            <button
                onClick={() => console.log('Button 1')}
                style={{
                flex: 1,
                padding: '8px 0',
                backgroundColor: '#af4c4cff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px' 
                }}
            >
               Quicksell for: 
            </button>



            </div>

        </div>
    )
  }
}

