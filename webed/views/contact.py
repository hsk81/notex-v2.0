__author__ = 'hsk81'

###############################################################################
###############################################################################

from flask import Blueprint
from flask import redirect
from flask import request

from flask.ext.mail import Message

from ..app import app
from ..ext import mail as mailer

###############################################################################
###############################################################################

contact = Blueprint ('contact', __name__)

###############################################################################
###############################################################################

@contact.route ('/feedback/', methods=['POST'])
def feedback ():

    recipients = app.config['DEFAULT_MAIL_RECEIVERS']
    assert recipients

    name = request.form.get ('name')
    assert name
    mail = request.form.get ('mail')
    assert mail
    text = request.form.get ('text')
    assert text

    subject = "Feedback: %s <%s>" % (name,mail)
    message = Message (subject, recipients=recipients)
    message.body = text
    mailer.send (message)

    return redirect ('/contact/')

###############################################################################
###############################################################################

app.register_blueprint (contact)

###############################################################################
###############################################################################
