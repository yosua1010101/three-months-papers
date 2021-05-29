import React, {useState} from 'react';

export default function FormPage({handleSectionChange}) {
  const [disabled, setDisabled] = useState(true)

  return(
    <form className="container" onSubmit={handleSectionChange()}>
      <textarea className="form-control" rows="10" onChange={(str)=>setDisabled(str.length===0?true:false)} placeholder="Type or paste the text you want to summarize"/>
      <button id="submitButton" className="btn btn-secondary" type="submit" disabled={disabled}>Submit</button>
    </form>
  );
}
