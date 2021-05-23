import React from 'react'

const SummarySuggestion = () => {
    //TODO: Make the summary suggestion block
}

export default function ResultPage(quantity) {
    var summarySuggestions = []
    for (var index=0 ; index < quantity ; index++){
        summarySuggestions.push(<SummarySuggestion/>)
    }
    return summarySuggestions;
}