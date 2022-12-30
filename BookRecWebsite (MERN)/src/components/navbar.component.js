// to link to different routes 
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
import { useState} from "react";
import {Button} from 'reactstrap';


// name of component: Navbar 
const NavbarCustom = props => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  function handleNavCollapse(){
    setIsNavCollapsed(!isNavCollapsed)

  }
  // const navButton = useRef(null);
  // const linksContainerRef = useRef(null);

  // function collapseNav() {
  //   navButton.current.classList.add("collapsed");
  //   linksContainerRef.current.classList.remove("show");
  // }


  // const [expanded, setExpanded] = useState(false);

  // const showNavBar = () => {
  //   navRef.current.classNameList.toggle("responsive_nav")
  // }

  const navigate = useNavigate();

  function removeToken() {

    console.log("clicked logout")
    const token = localStorage.getItem('jwtToken')
    if (token) {
      localStorage.removeItem("jwtToken");
      navigate("/login")
    }

  }

  // all components render something 
  const token = localStorage.getItem('jwtToken')

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" onClick={handleNavCollapse} >Home</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded={!isNavCollapsed ? true : false} onClick={handleNavCollapse} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={isNavCollapsed ? "collapse navbar-collapse" : "navbar-collapse"} id="navbarSupportedContent" >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item" onClick={handleNavCollapse}>
              <Link className="nav-link active" to="/search" >Search Books</Link>

            </li>
            <li className="nav-item" onClick={handleNavCollapse}>
              <Link to="/today_quote" className="nav-link active">Today's Quote</Link>
            </li>
            <li className="navbar-item" onClick={handleNavCollapse}>
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>

            <li className="nav-item dropdown" >
              <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Account
              </span>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li className="dropdown-item" onClick={handleNavCollapse}>
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
                <li className="dropdown-item" onClick={handleNavCollapse}>
                  {token ? (<Button onClick={removeToken}>Log out </Button>)
                    : (<Link to="/login" className="nav-link">Login</Link>)}
                </li>
              </ul>
            </li>


          </ul>

        </div>
      </div>
    </nav>

  );
}

export default NavbarCustom

