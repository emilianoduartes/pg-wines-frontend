import React from 'react';
import styles from './AdminAreaNavbar.module.css'
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router';


const AdminAreaNavbar = () => {
    let location = useLocation();
  const history = useHistory()
    
    return (
        <nav>
          <div className={styles.backIcon}><div className={styles.pointer}><i onClick={() => location.pathname === "/adminArea" ? history.push("/") : history.push("/adminArea")} className="fas fa-arrow-circle-left fa-3x"></i></div></div>
            <div className={styles.nav}>
                
                <div className={styles.manageProductIcon}><NavLink to="/manageProducts"><span>Productos</span></NavLink></div>
                <div className={styles.offersManagerIcon}><NavLink to="/offersManager"><span>Ofertas</span></NavLink></div>
                <span>Marcas</span>
                <span>Packing</span>
                <span>Categorías</span>
                
            </div>
        </nav>
    );
}



export default AdminAreaNavbar