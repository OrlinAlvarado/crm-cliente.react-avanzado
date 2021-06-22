import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const LOGIN = gql`
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario(input: $input){
        token
        }
    }
`;

const Login = () => {

    //State para el mensaje
    const [mensaje, setMensaje] = useState(null);

    //Mutation para crear nuevos usuarios
    const [ autenticarUsuario ] = useMutation(LOGIN);

    //Routing
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                      .email('El email no es válido')
                      .required('Ingrese un email'),
            password: Yup.string()
                         .required('Ingrese el password')

        }),
        onSubmit: async valores => {
            try {

                setMensaje('Autenticando...')

                const { data } = await autenticarUsuario({
                    variables: {
                       input: {
                           ...valores
                       }
                    }
                })
    

                const { token } = data.autenticarUsuario;

                localStorage.setItem('token', token);
                setTimeout(() => {
                    router.push('/');
                }, 500);
                
                //Redirigir al usuario
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
            <h1 className="text-center text-2xl text-white font-light">Login</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form 
                        className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={ formik.handleSubmit }
                    >
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
                                htmlFor="password" 
                                className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                className="shadow appereance-node border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Password usuario"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.password }
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
                            value="Iniciar sesión"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Login
