FROM python:3.8.10

COPY files /
ENV PATH .:$PATH
RUN cd /
WORKDIR /
RUN python -m pip install pip==20.0.2
RUN pip install -r requirements.txt
CMD [ "run.sh"]
