import React from 'react'
import Header from './component/Header'
import Footer from './component/Footer'
import TitleScreen from './component/TitleScreen'

function Main(){
    return (
        <div className='container'>
        <Header />
        <TitleScreen />
        <Footer />
        </div>

    );
}

export default Main