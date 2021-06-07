import React from 'react';
import axios from 'axios'

export default function FormPage({handleSectionChange, apiUrl}) {
  const [text, setText] = React.useState('')

  const handleSubmit = async(event)=>{
    event.preventDefault()
    // const form = new FormData();
    // form.append('input',JSON.stringify({'value':text}))
    // const jsonbuf = await axios.post(apiUrl, form);
    const jsonbuf = await axios({
      method:'post',
      url:'https://asia-southeast2-hiding-place-312704.cloudfunctions.net/summarizer',
      data:{
        value:text
      }
    });
    console.log(jsonbuf.data)
    handleSectionChange(jsonbuf.data);
  }

  return(
    <form className="container d-grid gap-2" onSubmit={handleSubmit}>
      <textarea 
        className="form-control" 
        rows="10" 
        value={text} 
        onChange={(e)=>setText(e.target.value)} 
        placeholder="Type or paste the text you want to summarize"
      />
      <button id="submitButton" className="btn btn-secondary my-3" type="submit" disabled={!text}>Submit</button>
    </form>
  );
}
