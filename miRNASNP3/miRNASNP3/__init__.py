from flask import Flask
from flask_restful import Api

app = Flask(__name__)

api = Api(app)

app.config.from_object('miRNASNP3.settings')

app.url_map.strict_slashes = False

import miRNASNP3.core
import miRNASNP3.controllers
import miRNASNP3.ajax
import miRNASNP3.predict_altutr
import miRNASNP3.predict_altmir
import miRNASNP3.predict_structure
