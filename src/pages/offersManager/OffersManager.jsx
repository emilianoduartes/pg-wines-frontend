import Swal from 'sweetalert2';
import uniqid from 'uniqid';
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import spinner from '../../assests/images/spinnerLargeBkTransparent.svg';
import { getOffers, postOffers, deleteOfferById, updateOfferById } from '../../redux/actions/offersManagerActions';
import { getAllProductsSlider, getCategories } from '../../redux/actions/manageProductsActions';
import { dateToString, sumToDate, restToDate, dateToSpanishString } from '../../helpers/helpers';
import AdminAreaNavbar from "../../components/adminAreaNavbar/AdminAreaNavbar";
import styles from './OffersManager.module.css';
import './OffersManagerToggle.css';

const initialState = {
    status: false,
    image: '',
    categoryId: 0,
    discount: 10,
    from: '',
    until: '',
    slug: '',
    offerDays: []
}

const initialDaysState = {
    lun: true,
    mar: true,
    mie: true,
    jue: true,
    vie: true,
    sab: true,
    dom: true,
}


const OffersManager2 = ({ offersState, getOffers, postOffers, getAllProductsSlider, productState, getCategories, categoriesState, deleteOfferById, updateOfferById }) => {
    const offers = offersState.offers;
    const [formState, setFormState] = useState(initialState);
    const [daysState, setDaysState] = useState(initialDaysState);

    let fileName = useRef(null);
    let fileInput = useRef(null);
    const now = new Date();

    useEffect(() => {
        setFormState({
            ...formState,
            from: dateToString(now),
            until: dateToString(now)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getOffers();
        getCategories();

    }, [getOffers, getCategories]);


    const handleOnChange = (event) => {
        const elem = event.target;

        switch (true) {
            case (elem.type === 'select-one'):

                setFormState({
                    ...formState,
                    [elem.name]: elem.value.toString(),
                });
                break;
            case (elem.type === 'date'):  
                setFormState({
                    ...formState,
                    [elem.name]: elem.value,
                })
                break;
            case (elem.type === 'number'):
                if (elem.value < 10 || elem.value > 70) {
                    Swal.fire({ icon: 'warning', text: 'El descuento debe ser entre el 10 y el 70 %' })
                    return;
                }
                setFormState({
                    ...formState,
                    discount: elem.value.toString()
                });
                break;
            case (elem.type === 'checkbox'):
                setFormState({
                    ...formState,
                    [elem.name]: elem.checked.toString()
                })
                break;
            case (elem.type === 'file'):
                let file = fileInput.current.files[0];
                if (file) fileName.current.value = file.name;

                setFormState((oldState) => {
                    return {
                        ...oldState,
                        image: file,
                        slug: file.name,
                    }
                });
                break;

            default:
                break;
        }

        // console.log('formset: ', formState)
    }

    const getDaysToWeek = () => {
        const daysToSend = [];
        for (let day in daysState) {
            if (daysState[day]) {
                daysToSend.push(day);
            }
        }
        return daysToSend;
    }

    const handleSave = (event) => {
        const offerDays = getDaysToWeek();
        const { image, categoryId, discount, from, until } = formState;

        switch (true) {
            case (discount <= 0):
                Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Ingresar un descuento para la categoría.', });
                break;
            case (offerDays.length <= 0):
                Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Seleccionar almenos un día de la semana en la que la oferta estara activa.', });
                break;
            // case (new Date(from) < new Date()):               
            //     Swal.fire({ icon: 'warning', title: 'Oops...', text: 'La fecha de inicio no puede ser inferior a hoy', });
            //     break;
            case (new Date(from) > new Date(until)):
                Swal.fire({ icon: 'warning', title: 'Oops...', text: 'La fecha fin debe ser posterior a la fecha de inicio.', });
                break;
            case (categoryId <= 0):
                Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Seleccionar una categoría.', });
                break;

            case (!image):
                Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Cargar una imagen.', });
                break;

            default:
                postOffers(formState, offerDays);
                break;
        }


    }

    const handlePhotoUpload = () => {
        fileInput.current.click();
    }

    const handleDelete = (id) => {
        deleteOfferById(id);
    }

    const handleChangeStatus = (id, status) => {
        updateOfferById(id, !status);
    }

    const getCategoryById = (idCategory) => {
        if (!categoriesState) return;
        const category = categoriesState?.filter(category => category.id === idCategory);
        const result = category[0]?.name;
        return result;
    }

    const handleOnChangeDayCheckbox = (event) => {
        setDaysState(
            {
                ...daysState,
                [event.target.name]: event.target.checked
            }
        )
        // console.log(daysState)
    }


    return (
        <div className={styles.flex_main_container}>
            <AdminAreaNavbar />

            {/* <div className={styles.header_container}>
               
                <div className={styles.title}>
                    <h1>Gestión de Ofertas</h1>
                </div>
              
            </div> */}
            <div className={styles.data_container}>
                {
                    offersState.fetching &&
                    <div className={styles.spinner_container} >
                        <img src={spinner} width="200px" alt="loading..." />
                    </div>
                }
                <div className={styles.sidebar_container}>
                    <div className={styles.form}>
                        <div id="status_descuento_container" className={styles.status_descuento_container}>
                            <div>
                                <label htmlFor="status">Status</label>
                                <Toggle name="status" id="status" defaultChecked={formState.toggle} onChange={handleOnChange} />
                            </div>
                            <div>
                                <label htmlFor="discount">Descuento</label>
                                <input type="number" min="10" max="70" name="discount" value={formState.discount} onChange={handleOnChange} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="from">Inicio</label>
                            <input type="date" id="from" name="from" value={formState.from} min={restToDate(now, 1)} onChange={handleOnChange} />
                        </div>
                        <div>
                            <label htmlFor="until">Fin</label>
                            <input type="date" id="until" name="until" value={formState.until} min={sumToDate(now, 1)} onChange={handleOnChange} />
                        </div>
                        <div>
                            <span>Días</span>
                        </div>
                        <div className={styles.days_container}>
                            <div className={styles.day}>
                                <input type="checkbox" id="lun" name="lun" value={daysState.lun} checked={daysState.lun} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="lun">L</label>
                            </div>
                            <div className={styles.day}>
                                <input type="checkbox" id="mar" name="mar" value={daysState.mar} checked={daysState.mar} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="mar">M</label>
                            </div>
                            <div className={styles.day}>
                                <input type="checkbox" id="mie" name="mie" value={daysState.mie} checked={daysState.mie} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="mie">M</label>
                            </div>
                            <div className={styles.day}>
                                <input type="checkbox" id="jue" name="jue" value={daysState.jue} checked={daysState.jue} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="jue">J</label>
                            </div>
                            <div className={styles.day}>
                                <input type="checkbox" id="vie" name="vie" value={daysState.vie} checked={daysState.vie} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="vie">V</label>
                            </div>
                            <div className={styles.day}>
                                <input type="checkbox" id="sab" name="sab" value={daysState.sab} checked={daysState.sab} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="sab">S</label>
                            </div>
                            <div className={styles.day}>
                                <input type="checkbox" id="dom" name="dom" value={daysState.dom} checked={daysState.dom} onChange={handleOnChangeDayCheckbox} />
                                <label htmlFor="dom">D</label>
                            </div>
                        </div>                         <div>
                            <label htmlFor="categoryId">Categoría</label>
                            <select name="categoryId" style={{ width: '231px', height: '25,56px' }} placeholder="Seleccionar categoria" id="categoryId" value={formState.categoryId} onChange={handleOnChange}>
                                <option>Seleccionar categoría</option>
                                {
                                    categoriesState.map(category => (
                                        <option key={uniqid()} value={category.id} > {category.name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <input type="text" id="fileName" name="fileName" disabled ref={fileName} placeholder="Nombre de la foto" className={styles.file_name_input} />
                            <input
                                value={formState.file}
                                ref={fileInput}
                                id="fileInput"
                                name="fileInput"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleOnChange}

                            />
                            <button onClick={handlePhotoUpload} className={styles.buttom}>Cargar Imagen</button>
                        </div>
                        <div>
                            <button
                                onClick={handleSave}
                                className={styles.buttom} >
                                Guardar
                            </button>
                        </div>
                    </div>


                </div>
                <div className={styles.info_container}>

                    <div className={styles.card_container}>
                        {
                            (offers.length > 0)
                                ?
                                (offers?.sort((a, b) => {
                                    if (a.id < b.id) {
                                        return 1;
                                    } else if (a.id > b.id) {
                                        return -1;
                                    }
                                    return 0;
                                }).map(offer => (
                                    <div key={uniqid()} className={styles.card}>
                                        <div>
                                            <img src={offer.image} alt="" style={{ width: '300px', height: '25,56px' }} />
                                        </div>
                                        <div className={styles.card_info}>
                                            <span>Inicio: {dateToSpanishString(offer.from)}</span>
                                            <span>Fin: {dateToSpanishString(offer.until)}</span>
                                        </div>
                                        <div className={styles.card_info}>
                                            <span>Categoría: {getCategoryById(offer.categoryId)}</span>
                                            <span>% {offer.discount}</span>
                                        </div>
                                        <div className={styles.card_status_delete}>
                                            {
                                                (offer.status)
                                                    ? <i onClick={(id) => handleChangeStatus(offer.id, offer.status)} className="fas fa-eye fa-2x" ></i>
                                                    : <i onClick={(id) => handleChangeStatus(offer.id, offer.status)} className="fas fa-eye-slash fa-2x" ></i>
                                            }
                                            <i onClick={(id) => handleDelete(offer.id)} className="fas fa-trash-alt fa-2x" ></i>
                                        </div>


                                    </div>

                                )))
                                : <div className={styles.offers_empty}>No hay imagenes cargadas en la base de datos...</div>
                        }

                    </div>

                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        offersState: state.offers,
        authState: state.auth,
        productState: state.manageProducts.products,
        categoriesState: state.manageProducts.categories,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getOffers: () => dispatch(getOffers()),
        getCategories: () => dispatch(getCategories()),
        postOffers: (file, slug, formState) => dispatch(postOffers(file, slug, formState)),
        getAllProductsSlider: () => dispatch(getAllProductsSlider()),
        deleteOfferById: (id) => dispatch(deleteOfferById(id)),
        updateOfferById: (id, status) => dispatch(updateOfferById(id, status)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OffersManager2);


