import React from 'react';
import { useRouter } from 'next/router';

const EditarCliente = () => {
    
    //obtener el ID actual
    const router = useRouter();
    
    const { query } = router;
    
    console.log(query);
    
    
    return (
       <h1>Desde editar cliente</h1>
    )
}

export default EditarCliente
