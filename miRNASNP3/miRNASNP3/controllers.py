from flask import render_template

from miRNASNP3 import app


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/test")
def test():
    return render_template("test.html")
