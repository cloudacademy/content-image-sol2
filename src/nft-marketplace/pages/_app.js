import '../styles/globals.css'
import HeaderComponent from "../components/header.js";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col items-center bg-slate-100 ">
      <HeaderComponent></HeaderComponent>            
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp
