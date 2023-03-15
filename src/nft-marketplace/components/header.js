import Link from 'next/link';
import {useRouter} from 'next/router';

const myNFTsPath = "/my-nfts";
const allNFTsPath = "/";

export default function HeaderComponent() {
  
  const router = useRouter();

  function renderLinkButton(pathToRenderFor){
    const isSelectedPath = router.route === pathToRenderFor;
    const buttonName = pathToRenderFor === allNFTsPath ? 'All NFTs' : 'My NFTs';

    return (
      <button className="relative p-0.5 inline-flex items-center justify-center group rounded-full overflow-hidden">
      <span className="w-full h-full bg-gradient-to-r bg-red-700 absolute"></span>
      <span className="relative px-6 py-3 bg-lime-700 rounded-full">
        {
          isSelectedPath ?
            <span className="absolute top-0 left-0 w-72 h-12 bg-red-700"></span>:
            <span className="absolute top-0 -left-72 w-72 h-12 bg-red-700 group-hover:translate-x-72  transition-all duration-300 ease-in-out "></span>
        }                   
        <span className="relative text-left text-white font-bald">{buttonName}</span>
      </span>
    </button>
   );
  }

  return (
   <nav className="w-full h-96 bg-no-repeat bg-cover bg-center bg-[url('/images/banner.png')]">
      <div className="flex h-full justify-center md:justify-end items-end py-4 md:px-32">
        <div className="px-2">
          <Link href={allNFTsPath}>
            {renderLinkButton(allNFTsPath)}
          </Link>
         </div>
         <div className="px-2">
           <Link href={myNFTsPath} >
            {renderLinkButton(myNFTsPath)}
           </Link>
         </div> 
      </div>
   </nav>
);
}
