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
                <a href="#" className="btn btn-primary btn-lg disabled" tabIndex="-1" role="button" aria-disabled="true">Primary link</a>
            </form>
        )
    }
}

export default Forms