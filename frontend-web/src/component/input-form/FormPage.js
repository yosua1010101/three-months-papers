import React, {useState} from 'react';

export default function FormPage({handleSectionChange}) {
  const [text, setText] = useState("")

  return(
    <form className="container d-grid gap-2" onSubmit={handleSectionChange()}>
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
