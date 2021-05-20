import React from 'react'
class Forms extends React.Component{
    handleChange = (event) => {

    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    render(){
        return(
            <form onSubmit="">
                <input type="file" />
                <button type="button" className="btn btn-primary disabled">Upload</button>
            </form>
        )
    }
}

export default Forms;