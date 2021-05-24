import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {TextareaAutosize} from '@material-ui/core';

function FormPage(props) {
  const [files, setFiles] = useState([]);
  
  const {getRootProps, getInputProps, open} = useDropzone({
    accept: ".pdf,application/pdf",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }))
      )
    },
    noClick: true,
    noKeyboard: true,
  });

  const fileInput = files.map((file) =>
    (
    <div key={file.name}>
      <div>
        {file.name} - {file.size}
        {console.log(files)}
        {/* <img src={file.preview} style={{ width: "200px" }} alt="preview"/> */}
      </div>
    </div>
    )
  )

  return(
    <form className="container" onSubmit={props.handleSectionChange}>
      <div className="box">
        <div {...getRootProps()} className="box-content">
          <input {...getInputProps()} />
          <TextareaAutosize aria-label="minimum height" rowsMin={20} placeholder="Drag and Drop Here" className="textarea"/>
          <div>{fileInput}</div>
          <div className="sticky-btn">
            <button className="btn btn-success" type="button" onClick={open}>Open File Dialog</button>
            <button id="submitButton" className="btn btn-secondary" type="submit" disabled={!files[0]}>Submit</button>
          </div>
        </div>
        <div className="divider"></div>
        <div className="box-content">
          <TextareaAutosize aria-label="minimum height" rowsMin={20} placeholder="Output" className="textarea"/>
        </div>
      </div>
    </form>
  );
}

export default FormPage;