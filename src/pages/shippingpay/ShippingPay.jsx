import React, { useEffect } from 'react';
import styles from './ShippingPay.module.css';
import CartProduct from '../../components/cart_product/CartProduct';
import { getTotalPrice } from '../../redux/actions/cartActions';
import { connect } from 'react-redux';


const ShippingPay = ({cartState, getTotalPrice, totalPrice}) => {
    return <>
        <div className={styles.bodyshipping}>
            <div className={styles.titlestilos}>
                <h2>Completar Transaccion</h2>
            </div>
            <div className={styles.revisararticulo}>
                <h4>Revisar articulo y envio</h4>
            </div>
            <div className={styles.checkoutshipping}>
                <div className={styles.buydetails}>
                    <div>
                    {cartState && cartState.map(el => 
                        <CartProduct image={el.image} name={el.name} cost={el.cost} id={el.id}
                        itemsAmount={el.itemsAmount} isCheckout={true}/>
                            )}


                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,320L1440,224L1440,320L0,320Z"></path></svg>


                    <div className={styles.addres}>
                        <div>
                            <h2>Enviar a</h2>
                        </div>
                        <div className={styles.lineaddres}></div>
                        <div className={styles.pais}>
                            <p>País o región</p>
                            <select name="" id="">
                                <option value="">usa</option>
                                <option value="">nic</option>
                            </select>
                        </div>
                        <div className={styles.datospersonales}>
                            <div>
                                <input type="text" placeholder="Nombre" />
                                <input type="text" placeholder="Apellido" />
                            </div>
                        </div>
                        <div className={styles.direccionenvio}>
                            <div>
                                <input type="text" placeholder="Direccion" />
                                <input type="text" placeholder="Direccion 2 (Opcional)" />
                            </div>
                        </div>
                        <div className={styles.ciudadestado}>
                            <div>
                                <input type="text" placeholder="Ciudad" />
                                <input type="text" placeholder="Estado, Provincia o Region" />
                                <input type="text" placeholder="Código Postal" />
                            </div>
                        </div>
                        <div className={styles.correoelectronico}>
                            <div>
                                <input type="text" placeholder="Correo electronico" />
                                <input type="text" placeholder="Confirmar correo electronico" />
                            </div>
                        </div>
                        <div className={styles.numerotelefono}>
                            <div>
                                <input type="number" placeholder="Numero de telefono" />
                            </div>
                        </div>
                        <div className={styles.botonlisto}>
                            <div>
                                <button>Listo</button>
                            </div>
                        </div>
                    </div>


                </div>
                <div className={styles.confirmpay}>
                    <div>
                        <div>
                            <table>
                            {cartState && cartState.map(el => 

                                <tr>
                                    <td className={styles.labelenvio}>{el.name}({el.itemsAmount})</td>
                                    <td className={styles.labelmount}>${el.cost}</td>
                                </tr>
                            )}
                            </table>
                            <table>
                                <tr>
                                    <td className={styles.labelenvio}>Envio</td>
                                    <td className={styles.labelmount}>Gratis</td>
                                </tr>
                            </table>
                        </div>
                        <div className={styles.lineacheckout}></div>
                        <table>
                            <tr>
                                <td className={styles.labeltotaltext}>Total</td>
                                <td className={styles.labeltotalmount}>${totalPrice}</td>
                            </tr>
                        </table>
                        <div className={styles.botonconfirmar}>
                            <div>
                                <button>Confirmar y pagar</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>





        </div>


    </>
}


  
const mapStateToProps = (state) => {
    return {
      cartState: state.cart.cartState,
      totalPrice: state.cart.totalPrice

    };
  }

   
  const mapDispatchToProps = (dispatch) => {
    return {
      getTotalPrice: () => dispatch(getTotalPrice())
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(ShippingPay);




