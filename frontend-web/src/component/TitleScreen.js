import React from "react"
import Forms from './Forms'

class TitleScreen extends React.Component{
    render(){
        return(
            <div id="titlename" className="text-center">
                <h1>SUMMARIZ-IT</h1>
                <h3>by Three Months Papers</h3>
                <br />
                <p>Feeling hard to get insight of a paper? Don't worry!</p>
                <p>Upload your paper here and we will give you summary suggestions</p>
                <Forms />
            </div>);
        }
}

export default TitleScreen