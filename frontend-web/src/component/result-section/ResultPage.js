import React from 'react'

const SummarySuggestion = () => {
    //TODO: Make the summary suggestion block
}

export default function ResultPage(props) {
    var summarySuggestions = []
    for (var index=0 ; index < props.quantity ; index++){
        summarySuggestions.push(<SummarySuggestion/>)
    }
    return (
        <div className="d-grid col-1">
            {summarySuggestions}
        </div>
        );
}