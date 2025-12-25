'use client'

import {useState} from 'react';
import {supabase} from '../lib/supabase'

interface entry
{
    id:number;
    name: string;
    class: string;
    max_amount : number;
    rarity : string;
    png_id : string;
    price : number;
}


function getImageUrl(png_id : string,type : string)
{
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    return `${supabaseUrl}/storage/v1/object/public/all_cards/${type}/${png_id}.png`;
}

async function createCardInstance(card : any, owner_id : number)
{
    const onError = await supabase.from('card_instance').insert(
        {
            template_id : card.id,
            owner_id : owner_id
        }
    ).select().single();


    console.log("Create an card instance", owner_id, card.id);
}


export default function SinglePack()
{
  const [isOpened, setterIsOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cardPrice, setCardPrice] = useState<number>(0);
  
  const [Card , setCard] = useState<any>();

  const [coins, setCoins] = useState<number>(0);

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
    setCoins(updatedCoins);

    const  data = await supabase.from('card_template').select('*').eq('id', randomCardID).single();
    const Card = data.data as entry;
    setCard(Card)
    setCardPrice(Card.price);
    console.log(data);

    const onError = await supabase.from('user_collection').update({coins: updatedCoins}).eq('id' , mockUserID)


    setImageUrl(getImageUrl(Card.png_id, Card.class));
    setCardDataJson(data.data);
    setterIsOpened(true);
  }

  const addToInventory = async () => {
      const mockUserID = 1;

      createCardInstance(Card, mockUserID);

      const {data : user} = await supabase.from('user_collection').select('inventory').eq('id', mockUserID).single();
      const newArray =[...user?.inventory || [], Card.id];
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
            onClick={addToInventory}
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
                onClick={quickSell}
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
               Quicksell for: {cardPrice} 
            </button>



            </div>

        </div>
    )
  }
}

