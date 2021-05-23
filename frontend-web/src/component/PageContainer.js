import React from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'
import FormPage from './input-form/FormPage'

class PageContainer extends React.Component{
    render(){
        return(
            <>
                <Header/>
                <TitleScreen/>
                <FormPage/>
                <Footer/>
            </>
        )
    }
}

export default PageContainer