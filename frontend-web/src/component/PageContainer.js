import React, {useState} from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'
import FormPage from './input-form/FormPage'
import ResultPage from './result-section/ResultPage'
import axios from 'axios'

export default function PageContainer({apiUrl}) {
    const [section, setSection] = useState("form")
    const [list, setList] = useState([])

    const changeToResult = (event)=> {
        event.preventDefault()
        setList(["Lorem ipsum, dolor sit amet consectetur adipisicing elit",
                 "Lorem ipsum, dolor sit amet consectetur adipisicing elit",
                 "Lorem ipsum, dolor sit amet consectetur adipisicing elit",
                 "Lorem ipsum, dolor sit amet consectetur adipisicing elit"]); //should be an array from response body
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

