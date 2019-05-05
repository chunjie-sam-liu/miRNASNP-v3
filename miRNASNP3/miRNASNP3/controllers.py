from flask import render_template
#from flask_limiter import Limiter
#from flask_limiter.util import get_remote_address

from miRNASNP3 import app

#limiter = Limiter(
#    app,
#    key_func=get_remote_address,
#    default_limits=["15 per minute", "5 per second"],
#)

@app.route("/")
# @limiter.limit("1 per day")
# def slow():
#     return "24"

def index():
    return render_template("index.html")


@app.route("/test")
def test():
    return render_template("test.html")
