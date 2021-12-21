import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client'
//Context de pedidos
import PedidoContext from '../../context/pedidos/PedidoContext';


const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos{
            id,
            nombre,
            precio,
            existencia
        }
    }
`;


const AsignarProductos = () => {
    const [productos, setProductos] = useState([]);

    //Context de pedidos
    const pedidoContext = useContext( PedidoContext );
    const { agregarProducto } = pedidoContext;
    //Consultar la base de datos
    const { data, loading, error } = useQuery( OBTENER_PRODUCTOS );

    if( loading ) return null;

    const { obtenerProductos } = data;


    useEffect(() => {
        agregarProducto(productos);
    }, [productos])

    const seleccionarProducto = productos => {
        setProductos(productos);
    }
    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Asigna productos al pedido</p>
            <Select 
                className="mt-3"
                options={ obtenerProductos } 
                isMulti={ true }
                onChange={ opcion => seleccionarProducto(opcion) }
                getOptionValue={ (opciones) => opciones.id }
                getOptionLabel={ (opciones) => `${ opciones.nombre } - ${ opciones.existencia } Disponibles` }
                placeholder="Selecione el producto"
                noOptionsMessage={ () => "No hay resultados" }
            />
        </>
    )
}

export default AsignarProductos
