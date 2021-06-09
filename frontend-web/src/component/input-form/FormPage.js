import React from 'react';
import axios from 'axios'

export default function FormPage({handleSectionChange}) {
  const CHAR_THRESHOLD = 100
  const TEST_TEXT = "There are times when the night sky glows with bands of color. The bands may begin as cloud shapes and then spread into a great arc across the entire sky. They may fall in folds like a curtain drawn across the heavens. The lights usually grow brighter, then suddenly dim. During this time the sky glows with pale yellow, pink, green, violet, blue, and red. These lights are called the Aurora Borealis. Some people call them the Northern Lights. Scientists have been watching them for hundreds of years. They are not quite sure what causes them. In ancient times people were afraid of the Lights. They imagined that they saw fiery dragons in the sky. Some even concluded that the heavens were on fire."
  const [text, setText] = React.useState('')
  const [textSent, setTextSent] = React.useState(false)

  const handleSubmit = async(event)=>{
    setTextSent(true)
    event.preventDefault()
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
      <div className="d-grid d-flex justify-content-center">
        <button type="button" id="testButton" className="btn btn-secondary m-3" onClick={(e)=>setText(TEST_TEXT)}>Test</button>
        <button id="submitButton" className="btn btn-secondary m-3" type="submit" disabled={(text.length < CHAR_THRESHOLD) || textSent}>{textSent?"Sending...":"Submit"}</button>
      </div>
    </form>
  );
}
