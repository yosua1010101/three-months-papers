import React from 'react'

const SummarySuggestion = ({element}) => {
    return (<>
        <div className="box row">
            <p>{element}</p>
        </div>
    </>)
}

export default function ResultPage({list}) {
    var summarySuggestions = []
    list.forEach(element => {
        summarySuggestions.push(<SummarySuggestion element={element}/>)
    });
    return (
        <div className="container d-grid gap-5">
            {summarySuggestions}
        </div>
        );
}