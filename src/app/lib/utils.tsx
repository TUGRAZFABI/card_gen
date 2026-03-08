import { supabase } from '../lib/supabase';

export function getImageUrl(png_id: string, type: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return `${supabaseUrl}/storage/v1/object/public/all_cards/${type}/${png_id}.webp`;
}

export async function deleteInstance(template_id: string) {
  const { error } = await supabase.from('card_instance').delete().eq('template_id', template_id);

  if (error) {
    console.log('Instance not deleted properly! Warning possible duplication');
  }
}

export async function updateUserCoins(userId: number, coins: number) {
  const { error: userError } = await supabase
    .from('user_collection')
    .select('coins')
    .eq('id', userId)
    .single();
  const { error: updateCoinsError } = await supabase
    .from('user_collection')
    .update({ coins: coins })
    .eq('id', userId)
    .single();

  if (userError) {
    console.log('User NOT found!');
  } else if (updateCoinsError) {
    console.log('Coins not updated!');
  }
}
