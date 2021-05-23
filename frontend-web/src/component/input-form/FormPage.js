import React, {useState} from 'react';

export default function FormPage() {
    const [file, setFile] = useState("")

    const handleFileChange = () => {
        setFile(document.querySelector('#fileInput').value)
    }
    function useAxios(params) {
        //TODO: Implement Axios to send pdf file to backend
    }

    return (
        <form className="" onSubmit={useAxios()}>
            <div className="d-grid gap-3 col-2 mx-auto">
                <input type="file" id="fileInput" accept=".pdf,application/pdf" onChange={handleFileChange}/>
                <br></br>
                <button id="submitButton" className="btn btn-secondary" type="submit" disabled={!file}>Submit</button>
            </div>
        </form>
    )
}