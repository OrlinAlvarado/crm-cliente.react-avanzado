import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const REGISTRAR_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
            id
            nombre
            apellido
        }
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor{
    obtenerClientesVendedor{
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;


const NuevoCliente = () => {
    
    //State para el mensaje
    const [mensaje, setMensaje] = useState(null);

    //Mutation para crear nuevos usuarios
    const [ nuevoCliente ] = useMutation(REGISTRAR_CLIENTE, {
        update(cache, { data: { nuevoCliente }}){
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO })
            
            //Rescribimos el cache, (el cache nucna se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
            
            
            
        }
    });
    
    //Routing
    const router = useRouter();
    
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                       .required('Ingrese un nombre'),
            apellido: Yup.string()
                       .required('Ingrese un apellido'),
            empresa: Yup.string()
                       .required('Ingrese la empresa'),
            email: Yup.string()
                      .email('El email no es válido')
                      .required('Ingrese un email'),
            telefono: Yup.string()

        }),
        onSubmit: async valores => {
            try {
                console.log(valores);
                setMensaje('Guardando...')

                const { data } = await nuevoCliente({
                    variables: {
                       input: {
                           ...valores
                       }
                    }
                })
    
                
                router.push('/');
                
                
            } catch (error) {
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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo cliente</h1>
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
                                htmlFor="apellido" 
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Apellido
                            </label>
                            <input 
                                type="text" 
                                id="apellido"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Apellido cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.apellido }
                            />
                        </div>
                        
                        { formik.touched.apellido && formik.errors.apellido && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.apellido }</p>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label 
                                htmlFor="empresa" 
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Empresa
                            </label>
                            <input 
                                type="text" 
                                id="empresa"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Empresa cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.empresa }
                            />
                        </div>
                        
                        { formik.touched.empresa && formik.errors.empresa && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.empresa }</p>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label 
                                htmlFor="email" 
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input 
                                type="email" 
                                id="email"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Email cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.email }
                            />
                        </div>
                        
                        { formik.touched.email && formik.errors.email && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.email }</p>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label 
                                htmlFor="telefono" 
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Teléfono
                            </label>
                            <input 
                                type="tel" 
                                id="telefono"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Teléfono cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.telefono }
                            />
                        </div>
                        
                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                            value="Registrar cliente"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoCliente
