import React, { useState, useEffect } from 'react';
import './App.css';


const App = () => {
    const [ordemVisita, setOrdemVisita] = useState([]);

    useEffect(() => {
        obterClientes();
    }, []);

    const obterClientes = async () => {
        try {
            const resposta = await fetch('http://localhost:3001/clientes');
            const clientes = await resposta.json();
            console.log('Clientes obtidos:', clientes);
        } catch (error) {
            console.error('Erro ao obter clientes:', error);
        }
    };

    const calcularRota = async () => {
        try {
            const resposta = await fetch('http://localhost:3001/calcular-ordem-visita');
            const { ordemVisita } = await resposta.json();
            setOrdemVisita(ordemVisita);
        } catch (error) {
            console.error('Erro ao calcular rota:', error);
        }
    };

    return (
        <div>
            <h1>Clientes</h1>

            <button onClick={calcularRota}>Calcular Rota</button>

            <div>
                <h2>Ordem de Visita dos Clientes</h2>
                <ul>
                    {ordemVisita.map(clienteId => (
                        <li key={clienteId}>Id do Cliente: {clienteId}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;





