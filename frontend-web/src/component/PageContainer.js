import React from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'
import FormPage from './input-form/FormPage'

export default function PageContainer() {
    return(
        <>
            <Header/>
            <TitleScreen/>
            <FormPage/>
            <Footer/>
        </>
    )
}

