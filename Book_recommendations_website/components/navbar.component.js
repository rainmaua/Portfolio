// to link to different routes 
import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
import {useState} from "react";



// name of component: Navbar 
const NavbarCustom = props => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  function handleNavCollapse(){
    setIsNavCollapsed(!isNavCollapsed)

  }


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" onClick={handleNavCollapse}>Homekkkk</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded={!isNavCollapsed ? true : false} onClick={handleNavCollapse} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={isNavCollapsed ? "collapse navbar-collapse" : "navbar-collapse"} id="navbarSupportedContent" >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item" onClick={handleNavCollapse}>
              <Link className="nav-link active" to="/search"  >Search Books</Link>

            </li>
            <li className="nav-item" onClick={handleNavCollapse}>
              <Link to="/today_quote" className="nav-link active">Today's Quote</Link>
            </li>
      

           


          </ul>

        </div>
      </div>
    </nav>

  );
}

export default NavbarCustom
