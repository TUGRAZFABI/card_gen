# Backend data organization:
For the whole database handling i used supabase with the supabase-js api for fetching or updating data. 
To initialize the api I used a specific handler which handles the initialization of the api each time I need it: 
```
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

```
Both the Url and Anon Key have to stay private for security reasons for example a third party could change or delete the whole database.
Both secret enviroment variables are saved on the Vercel project and is handled securly and should not leak.

The database is oganized like this:
Tables for the indvidual cards which feature thier name,id,price, the png id of the image in store container and a lot of metadata.
You can find the plain data in the cardData folder in the root of the project.
Example for a card table: 
<img width="1555" height="850" alt="image" src="https://github.com/user-attachments/assets/f2915ede-b6ed-48c9-ab05-6b52b1b870bb" />

The pictures for the cards come from a supabase bucket which holds all images of the cards and have the .webp datatype because for web application it loads way faster than .png or .jpg.
<img width="1612" height="809" alt="image" src="https://github.com/user-attachments/assets/52ab0d9d-ec37-4786-98c7-6fef9146b021" />
The pictures get fetched acsessing the image id (which is an column in each card table) and is fetched from this bucket with this function: 
```
//from the ../lib/utils
import { supabase } from '../lib/supabase';

export default function getImageUrl(png_id: string, type: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return `${supabaseUrl}/storage/v1/object/public/all_cards/${type}/${png_id}.webp`;
}
``



I have set an github workflow which automatically makes a simple ping to the database in order to keep my whole supabase project alive. (They delete youre free tier project after some inactivity)











This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

#For converrting the .png to .webp for faster loading I used: for file in _.jpg; do cwebp -q 80 "$file" -o "${file%._}.webp"; done
and then: find . -name "\*.png" -type f -delete for deleting the remaining .png
