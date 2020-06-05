import React from 'react'
import { FaSearch } from 'react-icons/fa'

import './style.css'

const Home = () => {

    const logo = require('../../assets/logo.svg')

    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="" />
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.</p>
                    <a>
                        <span><FaSearch /></span>
                        <strong>Pesquisar pontos de coleta</strong>
                    </a>
                </main>
            </div>
        </div>
    )
}

export default Home