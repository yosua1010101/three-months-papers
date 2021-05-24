import React, {useState} from 'react';

export default function FormPage(props) {
    const [file, setFile] = useState("")
    var fileInput = document.querySelector('#fileInput')

    const handleFileChange = () => {
        setFile(fileInput.value)
    }

    return (
        <form className="" onSubmit={props.handleSectionChange}>
            <div className="d-grid gap-3 col-2 mx-auto">
                <input type="file" id="fileInput" accept=".pdf,application/pdf" onChange={handleFileChange}/>
                <br></br>
                <button id="submitButton" className="btn btn-secondary" type="submit" disabled={!file}>Submit</button>
            </div>
        </form>
    )
}