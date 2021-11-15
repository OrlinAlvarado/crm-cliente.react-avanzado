import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2'


const OBTENER_CLIENTE = gql`
    query obtenerCliente($id:ID!){
        obtenerCliente(id:$id){
            id
            nombre
            apellido
            email
            telefono
            empresa
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id:ID!, $input: ClienteInput!){
        actualizarCliente(id: $id, input: $input){
            id
            nombre
            apellido
            email
            telefono
            empresa
        }
    }
`;

const EditarCliente = () => {
    
    //obtener el ID actual
    const router = useRouter();
    
    const { query:  { id } } = router;
    
    // console.log(id);

    const { data, loading, error } = useQuery( OBTENER_CLIENTE, {
        variables: {
            id 
        }
    });
    const [ actualizarCliente ] = useMutation( ACTUALIZAR_CLIENTE );


    const schemaValidacion = Yup.object({
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

    });

    if(loading) return "Cargando...";

    const { obtenerCliente } = data;

    //Modificar el cliente en la base de datos
    const actualizarInfoCliente = async (valores) => {
        try {

            const { nombre, apellido, email, empresa, telefono } = valores;
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                       nombre,
                       apellido, 
                       email,
                       empresa,
                       telefono
                    }
                }
            })

            Swal.fire(
                'Actualizado',
                'Cliente actualizado',
                'success'
            )

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerCliente }
                        onSubmit={ (valores, funciones) => {
                            actualizarInfoCliente(valores);
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
                                        placeholder="Nombre cliente"
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
                                        htmlFor="apellido" 
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Apellido
                                    </label>
                                    <input 
                                        type="text" 
                                        id="apellido"
                                        className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Apellido cliente"
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.apellido }
                                    />
                                </div>
                                
                                { props.touched.apellido && props.errors.apellido && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{ props.errors.apellido }</p>
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
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.empresa }
                                    />
                                </div>
                                
                                { props.touched.empresa && props.errors.empresa && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{ props.errors.empresa }</p>
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
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.email }
                                    />
                                </div>
                                
                                { props.touched.email && props.errors.email && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{ props.errors.email }</p>
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
                                        onChange={ props.handleChange }
                                        onBlur={ props.handleBlur }
                                        value={ props.values.telefono }
                                    />
                                </div>
                                
                                <input 
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                                    value="Actualizar cliente"
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

export default EditarCliente
