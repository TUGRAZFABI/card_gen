import Inventory from '../components/inventory';
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

export async function removeFromMarketAndChangeOwnership(card: any, buyerId: number) {
  const { error } = await supabase
    .from('marketplace')
    .delete()
    .eq('card_instance_id', card.instance_id);

  const { data: UserInventory } = await supabase
    .from('user_collection')
    .select('inventory')
    .eq('id', buyerId)
    .single();

  if (UserInventory == null) {
    return;
  }

  const cardToAdd = [card.class + ',' + card.instance_id + ',' + card.id];
  const updatedInventory = [...UserInventory.inventory, ...cardToAdd];

  const { error: InventoryError } = await supabase
    .from('user_collection')
    .update({ inventory: updatedInventory })
    .eq('id', buyerId);

  if (error) {
    console.log('Instance not deleted properly! Warning possible duplication');
  }
}

export async function updateUserCoins(userId: number, coins: number) {
  const { error: userError, data: userData } = await supabase
    .from('user_collection')
    .select('coins')
    .eq('id', userId)
    .single();

  if (userError) {
    console.log(userError);
  }

  console.log(userData?.coins, coins);

  const updatedCoins = userData?.coins - coins;
  const { error: updateCoinsError } = await supabase
    .from('user_collection')
    .update({ coins: updatedCoins })
    .eq('id', userId);
}
