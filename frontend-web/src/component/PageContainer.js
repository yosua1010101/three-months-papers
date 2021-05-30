import React, {useState} from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'
import FormPage from './input-form/FormPage'
import ResultPage from './result-section/ResultPage'

export default function PageContainer() {
    const [section, setSection] = useState("form")
    const [list, setList] = useState([])

    const changeToResult = (event)=> {
        event.preventDefault()
        setList(["Lorem ipsum, dolor sit amet consectetur adipisicing elit",
                 "Lorem ipsum, dolor sit amet consectetur adipisicing elit",
                 "Lorem ipsum, dolor sit amet consectetur adipisicing elit",
                 "Lorem ipsum, dolor sit amet consectetur adipisicing elit"]);
        setSection('result');
    }

    return(
        <>
            <Header/>
            <TitleScreen/>
            {section === 'form' && <FormPage handleSectionChange={()=>changeToResult}/>}
            {section === 'result' && <ResultPage list={list}/>}
            <Footer/>
        </>
    )
}

