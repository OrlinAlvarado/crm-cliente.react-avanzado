import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput){
        nuevoUsuario(input: $input){
            id
            nombre
            apellido
            email
        }
    }
`;

const NuevaCuenta = () => {

    //State para el mensaje
    const [mensaje, setMensaje] = useState(null);
    //Mutation para crear nuevos usuarios
    const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

    //Routing
    const router = useRouter();

    //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                       .required('El Nombre es obligatorio'),
            apellido: Yup.string()
                       .required('El Apellido es obligatorio'),
            email: Yup.string()
                       .email('El Email no es válido')
                       .required('El email es obligatorio'),
            password: Yup.string()
                       .required('El Password es obligatorio')
                       .min(6, 'El Password debe ser de al menos 6 carácteres'),
        }),
        onSubmit: async valores => {
            // console.log('Enviando');
            //console.log(valores);
            // const { nombre, apellido,email,  password } = valores;


            try {
                const { data } = await nuevoUsuario({
                    variables: {
                       input: {
                           ...valores
                       }
                    }
                })
    
                setMensaje(`Se creo correctamente el Usuario: ${ data.nuevoUsuario.nombre }`);

                //Usuario creado correctamente

                setTimeout(() => {
                    router.push('/login');
                }, 4000);



                //Redirigir al usuario
            } catch (error) {
                setMensaje(error.message)
            }
           
        }
    });

    // if(loading) return 'Cargando...';

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

            <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form
                        className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                                placeholder="Nombre usuario"
                                value={ formik.values.nombre }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
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
                                placeholder="Apellido usuario"
                                value={ formik.values.apellido }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
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
                                htmlFor="email"
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Email usuario"
                                value={ formik.values.email }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
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
                                htmlFor="password"
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Password usuario"
                                value={ formik.values.password }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                            />
                        </div>

                        { formik.touched.password && formik.errors.password && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{ formik.errors.password }</p>
                            </div>
                        )}

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                            value="Crear cuenta"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevaCuenta
