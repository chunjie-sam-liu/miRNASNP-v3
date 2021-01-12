import os, sys
from miRNASNP3 import app


def runserver(myport):
    myport = myport
    port = int(os.environ.get('PORT', myport))
    app.run(host='222.20.95.101', port=port)
    app.run()


if __name__ == '__main__':
    runserver(sys.argv[1])
