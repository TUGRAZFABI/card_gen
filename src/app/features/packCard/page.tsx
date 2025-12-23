import {supabase} from '../../lib/supabase'

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
    return `${supabaseUrl}/storage/v1/object/public/all_cards/${type}/${png_id}.png`

}



export default async function Page()
{


    const mockRNG = 1;
    const  data = await supabase.from('card_template').select('*').eq('id', mockRNG).single();
    console.log(data);

    const card = data.data as entry;

    const imageURL = getImageUrl(card.png_id, card.class)
    console.log(imageURL);
//https://gffqqtooajyeotnqoamv.supabase.co/storage/v1/object/public/all_cards/MTG/0004.png

    return(
        

        <div className='mb-12'>
            <h1 className='text-3xl'> cards</h1>

            <img src={imageURL}
            alt='card.name'>  
            </img>


        <div className='mb-12'>
            <h2 className='text-3xl'> raw json </h2> 
            <pre>
                {JSON.stringify(data,null,2)}
            </pre>
        </div>
        </div>
    )

}
