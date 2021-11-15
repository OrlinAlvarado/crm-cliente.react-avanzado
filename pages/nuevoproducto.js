import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const REGISTRAR_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input: $input){
            id
            nombre
            existencia
            precio
        }
    }
`;

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


const NuevoProducto = () => {
    
    //State para el mensaje
    const [mensaje, setMensaje] = useState(null);

    //Mutation para crear nuevos usuarios
    const [ nuevoProducto ] = useMutation(REGISTRAR_PRODUCTO, {
        update(cache, { data: { nuevoCliente }}){
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });
            
            //Rescribimos el cache, (el cache nucna se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
            
            
            
        }
    });
    
    //Routing
    const router = useRouter();
    
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
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
        }),
        onSubmit: async valores => {
            try {
                console.log(valores);
                setMensaje('Guardando...')

                const { nombre, existencia, precio } = valores;

                const { data } = await nuevoProducto({
                    variables: {
                       input: {
                           nombre,
                           existencia,
                           precio
                       }
                    }
                })
    
                
                router.push('/productos');
                
                
            } catch (error) {
                console.log(error);
                setMensaje(error.message)
            }
        }
    });
    
    const mostrarMensaje = () => {
        setTimeout(() => {
            setMensaje(null);
        }, 3000);
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    
    return (
        <Layout>
            { mensaje && mostrarMensaje() }
            <h1 className="text-2xl text-gray-800 font-light">Nuevo producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={ formik.handleSubmit }
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
                                placeholder="Nombre cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.nombre }
                            />
                        </div>
                        
                        { formik.touched.nombre && formik.errors.nombre && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.nombre }</p>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label 
                                htmlFor="existencia" 
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Cantidad dispnible
                            </label>
                            <input 
                                type="number" 
                                id="existencia"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Existencia"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.existencia }
                            />
                        </div>
                        
                        { formik.touched.existencia && formik.errors.existencia && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.existencia }</p>
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
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.precio }
                            />
                        </div>
                        
                        { formik.touched.precio && formik.errors.precio && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.precio }</p>
                            </div>
                        )}
                        
                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                            value="Registrar producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoProducto
