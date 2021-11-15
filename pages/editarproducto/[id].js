import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2'


const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id:ID!){
        obtenerProducto(id:$id){
            id
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id:ID!, $input: ProductoInput!){
        actualizarProducto(id: $id, input: $input){
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () => {
    
    //obtener el ID actual
    const router = useRouter();
    
    const { query:  { id } } = router;
    
    // console.log(id);

    const { data, loading, error } = useQuery( OBTENER_PRODUCTO, {
        variables: {
            id 
        }
    });
    const [ actualizarProducto ] = useMutation( ACTUALIZAR_PRODUCTO );


    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                   .required('Ingrese un nombre'),
        existencia: Yup.number()
                   .required('Ingrese un existencia')
                   .positive('No se aceptan numeros negativos')
                   .integer('La exitencia deben ser números enteros'),
        precio: Yup.number()
                   .required('Ingrese precio')
                   .positive('No se aceptan numeros negativos')
                   .integer('La existencia deben ser números enteros')
    });

    if(loading) return "Cargando...";

    const { obtenerProducto } = data;

    //Modificar el cliente en la base de datos
    const actualizarInfoProducto = async (valores) => {
        try {

            const { nombre, existencia, precio } = valores;
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                       nombre,
                       existencia, 
                       precio
                    }
                }
            })

            Swal.fire(
                'Actualizado',
                'Producto actualizado',
                'success'
            )

            router.push('/productos')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProducto }
                        onSubmit={ (valores, funciones) => {
                            actualizarInfoProducto(valores);
                        }}
                    >
                    {

                    props => {
                        return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={ props.handleSubmit }
                            >
                                <div className="mb-4">
                                    <label 
                                        htmlFor="nombre" 
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Nombre
                                    </label>
                                    <input 
                                        type="text" 
                                        id="nombre"
                                        className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Nombre producto"
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.nombre }
                                    />
                                </div>
                                
                                { props.touched.nombre && props.errors.nombre && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{ props.errors.nombre }</p>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <label 
                                        htmlFor="existencia" 
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Existencia
                                    </label>
                                    <input 
                                        type="number" 
                                        id="existencia"
                                        className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Existencia"
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.existencia }
                                    />
                                </div>
                                
                                { props.touched.existencia && props.errors.existencia && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{ props.errors.existencia }</p>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <label 
                                        htmlFor="precio" 
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Precio
                                    </label>
                                    <input 
                                        type="number" 
                                        id="precio"
                                        className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Precio"
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.precio }
                                    />
                                </div>
                                
                                { props.touched.precio && props.errors.precio && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{ props.errors.precio }</p>
                                    </div>
                                )}
                                
                                <input 
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                                    value="Actualizar producto"
                                />
                            </form>
                        )
                    }}
                        
                    </Formik>
                </div>
            </div>


        </Layout>
    )
}

export default EditarProducto
