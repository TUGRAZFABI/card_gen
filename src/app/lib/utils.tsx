import {supabase} from '../lib/supabase'



export default function getImageUrl(png_id : string,type : string)
{
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

    return `${supabaseUrl}/storage/v1/object/public/all_cards/${type}/${png_id}.webp`;
}