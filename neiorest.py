from flask import Flask,\
        render_template,\
        request,\
        session,\
        json,\
        g,\
        redirect,\
        jsonify
import requests
import sqlite3
import config

app = Flask(__name__)

class Template(object):
    def __init__(self, name, req = None):
        self.name = name
        self.request = req

    def export(self):
        return str(self.request)

class Request(object):
    def __init__(self):
        self.url = ''
        self.method = 'get'
        self.parameters = []

    @staticmethod
    def fromForm(url, method, keys, values, actives):
        obj = Request()
        obj.url = url
        obj.method = method.lower()
        obj.parameters = [Parameter(k, v, a) for k, v, a in zip(keys, values,
            actives)]

        return obj

    @staticmethod
    def fromJson(raw):
        decoded = json.loads(raw)
        obj = Request()
        obj.url = decoded['url']
        obj.method = decoded['method']
        obj.parameters = decoded['parameters']

        return obj

    def query(self):
        params = dict([(p.key, p.value) for p in self.parameters if p.active])
        if self.method == 'get':
            return requests.get(self.url, params=params, verify=False)
        if self.method == 'post':
            return requests.post(self.url, data=params, verify=False)
        return None

    def __str__(self):
        return '{"url": "%s", "method": "%s", "parameters": [%s]}' % (self.url, self.method, ', '.join([str(p) for p in self.parameters]))

class Parameter(object):
    def __init__(self, key='', value='', active=True):
        self.key = key
        self.value = value
        self.active = active

    def __str__(self):
        return '{"key": "%s", "value": "%s", "active": %s}' % (self.key,
                self.value, 'true' if self.active else 'false')

def load_request():
    print('loading request')
    if 'request' in session:
        reqmap = json.loads(session['request'])
        req = Request()
        req.url = reqmap['url']
        req.method = reqmap['method']
        req.parameters = [Parameter(p['key'], p['value'], p['active']) for p in reqmap['parameters']]
    else:
        req = Request()
        req.parameters.append(Parameter())
    return req

def connect_db():
    db = sqlite3.connect(app.config['DATABASE'])
    db.row_factory = lambda cur, row: dict((cur.description[idx][0], value) for idx, value in enumerate(row))

    if db is None:
        raise Exception('Could not connect to database')
    return db

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def get_db():
    print('connecting to db')
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        print('closing db connection')
        db.close()

def get_templates():
    return [Template(row['name'], Request.fromJson(row['data'])) for row in query_db('select * from `templates`')]

def get_template(name):
    print(name);
    row = query_db('SELECT * FROM `templates` WHERE `name` = ?', [name], one=True)
    return Template(row['name'], Request.fromJson(row['data']))

def save_template(template):
    print('saving template')
    data = template.export()
    db = get_db()
    db.execute('INSERT OR REPLACE INTO `templates` (`name`, `data`) VALUES (?, ?)', (template.name, data))
    db.commit()


def request_from_form(request):
    url = request.form.get('requestUrl', '', type=str)
    keys = request.form.getlist('requestKeys')
    values = request.form.getlist('requestValues')
    actives = request.form.getlist('requestActives')
    method = request.form.get('requestMethod', 'post', type=str).lower()

    req = Request.fromForm(url, method, keys, values, actives)
    return req

@app.route('/reset')
def reset():
    del session['request']
    return redirect('/', code=302)


@app.route("/")
def index():
    return render_template('index.html',
            request=load_request(),
            templates=get_templates())

@app.route("/load", methods=['POST'])
def load():
    print(request.form)
    name = request.form.get('templateName', '', type=str)
    print("name: %s" % name)
    template = get_template(name)
    print("template: %s" % template)
    req = template.request
    print("req: %s" % req)
    return render_template('request.html',
            request=req,
            templates=get_templates())

@app.route("/save", methods=['POST'])
def save():
    req = request_from_form(request)

    name = request.form.get('templateName', '', type=str)

    t = Template(name, req)
    res = save_template(t)

    session['request'] = str(req)

    return 'Template saved'

@app.route("/query", methods=['POST'])
def query():
    req = request_from_form(request)
    resp = req.query();

    print(str(req))
    session['request'] = str(req)

    headers = {k: resp.headers[k] for k in resp.headers}
    return jsonify(
        content = resp.text,
        status_code = resp.status_code,
        headers = headers,
    )

if __name__ == "__main__":
    app.config.from_object(config.__name__)
    app.run()
