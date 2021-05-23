import React from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'

class PageContainer extends React.Component{
    render(){
        return(
            <>
                <Header/>
                <TitleScreen/>
                <Footer/>
            </>
        )
    }
}

export default PageContainer