import React from 'react'

const SummarySuggestion = ({element, index}) => {
    return (<>
        <div className="box row" key={index}>
            <p>{element}</p>
        </div>
    </>)
}

export default function ResultPage({list}) {
    var summarySuggestions = []
    list.forEach((element, index) => {
        summarySuggestions.push(<SummarySuggestion element={element} key={index}/>)
    });
    return (
        <div className="container d-grid gap-5">
            {summarySuggestions}
        </div>
        );
}