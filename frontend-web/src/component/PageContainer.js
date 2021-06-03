import React, {useState} from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'
import FormPage from './input-form/FormPage'
import ResultPage from './result-section/ResultPage'
import ErrorRedirect from './error-section/ErrorRedirect'


export default function PageContainer({apiUrl}) {
    const [section, setSection] = useState("form")
    const [list, setList] = useState([])


    const changeToResult = (jsonstr)=> {
        let obj = jsonstr
        let objList = Object.keys(obj).map((key)=>obj[key])
        setList(objList); //should be an array from response body
        setSection('result');
    }

    return(
        <>
            <Header/>
            <TitleScreen/>
            {section === 'form' && <FormPage handleSectionChange={(jsonbuf)=>changeToResult(jsonbuf)} apiUrl={apiUrl}/>}
            {section === '400' && <ErrorRedirect/>}
            {section === 'result' && <ResultPage list={list}/>}
            <Footer/>
        </>
    )
}

