import random
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.summarizers.luhn import LuhnSummarizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
import nltk
nltk.download('punkt')

def summarize(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    # request_json = request.get_json()
    # if request.args and 'message' in request.args:
    #     return request.args.get('message')
    # elif request_json and 'message' in request_json:
    #     return request_json['message']
    # else:
    #     return f'Hello World!'
    print(request)
    
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
            'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    headers = {
        'Access-Control-Allow-Origin': '*',
    }
    request_json = request.get_json()
    print(request_json)
    document = request_json['value']
    
    parser = PlaintextParser.from_string(document,Tokenizer("english"))

    summaries = {}
    number_pool = [0,1,2,3]
    random.shuffle(number_pool)

    for i in range(len(number_pool)):
        if number_pool[i] == 0:
            summarizer = LexRankSummarizer()
        if number_pool[i] == 1:
            summarizer = LuhnSummarizer()
        if number_pool[i] == 2:
            summarizer = LsaSummarizer()
        if number_pool[i] == 3:
            summarizer = LsaSummarizer(Stemmer("english"))
            summarizer.stop_words = get_stop_words("english")
        
        summary = summarizer(parser.document,2)
        sum_string = []
        for sentence in summary:
            sum_string.append(str(sentence))
        summaries[f'{i}'] = " ".join(sum_string)

    return (summaries, 200, headers)