import React, {useState} from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import TitleScreen from './common/TitleScreen'
import FormPage from './input-form/FormPage'
import ResultPage from './result-section/ResultPage'
import axios from 'axios'

export default function PageContainer() {
    const [section, setSection] = useState("form")
    const [lists, setLists] = useState([])
    var fileInput = document.querySelector('#fileInput')

    const changeToResult = ()=> {
        setSection('result')
    }

    function useAxios() {
        const data = new FormData()
        data.append('file',fileInput.files[0])
        axios.post("", data)
             .then((response)=>{
                 changeToResult()
             },(error)=>{})
             
    }

    return(
        <>
            <Header/>
            <TitleScreen/>
            {section === 'form' && <FormPage handleSectionChange={()=>useAxios}/>}
            {section === 'result' && <ResultPage quantity={0}/>}
            <Footer/>
        </>
    )
}

