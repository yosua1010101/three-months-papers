import random
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.summarizers.luhn import LuhnSummarizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
from sumy.summarizers import AbstractSummarizer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem.snowball import SnowballStemmer
from operator import itemgetter
nltk.download('punkt')
nltk.download('stopwords')

class PureNLTKSummarizer(AbstractSummarizer):
    stemmer = SnowballStemmer("english")
    _stop_words = set(stopwords.words("english"))

    def _to_sentence_list(self, document):
        sentences = document.sentences
        return [str(sentence) for sentence in sentences]

    def __call__(self, document, sentence_count):
        #sentences = sent_tokenize(document)
        sentences = self._to_sentence_list(document)
        sentenceData = []
        for i in range(len(sentences)):
            sentence = sentences[i]
            sentenceDatum = {
                'index': i,
                'sentence': sentence,
                'frequency': 0
            }
            sentenceData.append(sentenceDatum)

        words = word_tokenize(" ".join(sentences))
        frequency_table = {}
        for word in words:
            word = word.lower()
            if word in self._stop_words:
                continue
            word = self.stemmer.stem(word)
            if word in frequency_table:
                frequency_table[word] += 1
            else:
                frequency_table[word] = 1
        
        for sentenceDatum in sentenceData:
            for word, freq in frequency_table.items():
                if word in sentenceDatum['sentence'].lower():
                    sentenceDatum['frequency'] += freq
        
        sentenceData.sort(key=itemgetter('frequency'), reverse=True)
        new_sentence_data = sentenceData[0:sentence_count]
        new_sentence_data.sort(key=itemgetter('index'))
        return tuple([sentence_datum['sentence'] for sentence_datum in new_sentence_data])

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
    try:
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
        document = request_json['value']
    except: #for local try using py main.py
        headers = None
        document = request['value']
    finally:

        parser = PlaintextParser.from_string(document,Tokenizer("english"))

        summaries = {}
        number_pool = [0,1,2,3]
        random.shuffle(number_pool)
        print(number_pool)

        for i in range(len(number_pool)):
            if number_pool[i] == 0:
                summarizer = LexRankSummarizer()
            if number_pool[i] == 1:
                summarizer = LuhnSummarizer()
            if number_pool[i] == 2:
                summarizer = LsaSummarizer(Stemmer("english"))
                summarizer.stop_words = get_stop_words("english")
            if number_pool[i] == 3:
                summarizer = PureNLTKSummarizer()
            
            summary = summarizer(parser.document,3)
            sum_string = []
            for sentence in summary:
                sum_string.append(str(sentence))
            summaries[f'{i}'] = " ".join(sum_string)
        if headers is None:
            return summaries
        return (summaries, 200, headers)

if __name__ == "__main__":
    request = {
        "value": "There are times when the night sky glows with bands of color. The bands may begin as cloud shapes and then spread into a great arc across the entire sky. They may fall in folds like a curtain drawn across the heavens. The lights usually grow brighter, then suddenly dim. During this time the sky glows with pale yellow, pink, green, violet, blue, and red. These lights are called the Aurora Borealis. Some people call them the Northern Lights. Scientists have been watching them for hundreds of years. They are not quite sure what causes them. In ancient times people were afraid of the Lights. They imagined that they saw fiery dragons in the sky. Some even concluded that the heavens were on fire."
    }
    print(summarize(request))