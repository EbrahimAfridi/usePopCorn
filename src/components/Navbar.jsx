import "./index.css";
import Logo from "./Logo.jsx";



export default function Navbar({children}){

  return(
    <nav className="nav-bar">
      <Logo/>
      {children}
    </nav>
  );
}