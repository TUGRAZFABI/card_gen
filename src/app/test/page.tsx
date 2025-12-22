import {supabase} from '../lib/supabase'

export default async function Page()
{
    const  data = await supabase.from('card_template').select('id,name');
    console.log(data);
    
    return(
        <div className='mb-12'>
            <h1 className='text-3xl'> cards</h1>


        <div className='mb-12'>
            <h2 className='text-3xl'> raw json </h2> 
            <pre>
                {JSON.stringify(data,null,2)}
            </pre>
        </div>
        </div>

        
    )

}
