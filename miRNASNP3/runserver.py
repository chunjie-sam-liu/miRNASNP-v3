import sys
import os
from miRNASNP3 import app


def runserver(port):
    #port = int(os.environ.get('PORT', 3000))
    app.run(host='211.67.31.244', port=int(port))
    app.run()

if __name__ == '__main__':
    runserver(sys.argv[1])
