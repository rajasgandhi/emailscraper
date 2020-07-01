from flask import Flask, render_template, jsonify, request
import re
from requests_html import HTMLSession, AsyncHTMLSession
from selenium import webdriver
import os

app = Flask(__name__)

returndict = {}

@app.route("/")
@app.route("/index")
def main():
    return render_template('index.html')

@app.route("/output" , methods=["POST"])
def output():
    form = request.form
    domains = form['url']
    emails = logic(domains)
    return render_template('output.html', emails = emails, length=(len(emails) != 0))

@app.route("/api", methods=['GET'])
def api():
    url=request.args.get('url')
    apikey=request.args.get('apikey')
    if apikey is None:
        return {"Invalid Response":"Make sure API key is present!"}
    elif url is None:
        return {"Invalid Response": "Make sure URL is present!"}
    else:
        try:
            return jsonify(logic(url))
        except:
            return {"Invalid Response": "Make sure URL is in proper format!"}

def logic(urls):
    try:
        '''new_loop=asyncio.new_event_loop()
        asyncio.set_event_loop(new_loop)
        session = AsyncHTMLSession()
        browser = launch({
            'ignoreHTTPSErrors':True, 
            'headless':True, 
            'handleSIGINT':False, 
            'handleSIGTERM':False, 
            'handleSIGHUP':False,
            'args': ['--no-sandbox', '--disable-setuid-sandbox']
        })
        session._browser = browser'''
        session = HTMLSession()
        urls1=urls.split(',')
        emails1=[]
        for url in urls1:
            emails = fetch(url, session)
            for email in emails:
                emails1.append(email)
        
        for i in range(len(emails1)):
            if(i % 2 == 1):
                emails1.pop(i-1)

        for i in range(len(emails1)):
            returndict.update({'email' + str(i+1):emails1[i]})

        return returndict
    except Exception as e:
        print(e)
        falseret=[]
        return falseret

def fetch(url, session):
    '''url=str(url).lower()
    if (url.startswith("https://")):
        url = "http://" + url[8:]
        print (url)
    elif (url.startswith("http://")):
        pass
    else:
        url = "http://" + url
    r = session.get(url)
    r.html.render(sleep=1, keep_page=True, scrolldown=1)
    return re.findall("([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)", r.html.html)'''
    firefox_options=webdriver.FirefoxOptions()
    firefox_options.binary_location = os.environ.get('FIREFOX_BIN')
    firefox_options.add_argument("--headless")
    firefox_options.add_argument("--disable-dev-shm-usage")
    firefox_options.add_argument("--no-sandbox")
    driver = webdriver.Firefox(executable_path=os.environ.get('GECKODRIVER_PATH'), firefox_options=firefox_options)
    driver.get(url)
    html=driver.execute_script("return document.documentElement.outerHTML")
    return re.findall("([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)", html)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    #app.run(debug=True)