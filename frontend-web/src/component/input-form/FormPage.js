import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {TextareaAutosize} from '@material-ui/core';

export default function FormPage({handleSectionChange}) {
  const [files, setFiles] = useState([]);

  const {getRootProps, getInputProps, open} = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }))
      )
    },
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDropRejected: ()=>{alert("File is not a PDF")},
  });

  const fileInput = files.map((file) =>
    (
    <div key={file.name}>
      <div>
        {file.name} - {file.size}
        {console.log(files)}
      </div>
    </div>
    )
  )

  return(
    <form className="container" onSubmit={handleSectionChange()}>
      <div className="box">
        <div {...getRootProps()} className="box-content">
          <input {...getInputProps()} />
          <TextareaAutosize aria-label="minimum height" rowsMin={20} placeholder="Drag and Drop an Article here" className="textarea"/>
          <div className="sticky-btn">
            <button className="btn btn-success" type="button" onClick={open}>Open File Dialog</button>
            <div className='py-2'/>
            <button id="submitButton" className="btn btn-secondary" type="submit" disabled={!files[0]}>Submit</button>
          </div>
        </div>
        <div className="divider"/>
        <div>{fileInput}</div>
      </div>
    </form>
  );
}
