import Studio from './Studio';
export const dynamic='force-dynamic';
export default function StudioPage(){
 if(!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)return <main style={{padding:40,color:'white',background:'#080808',minHeight:'100vh'}}><h1>Connect Sanity Studio</h1><p>Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local, then restart the development server.</p></main>;
 return <Studio/>;
}
