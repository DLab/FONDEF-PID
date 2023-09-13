export FLASK_APP=rest-service.py
export FLASK_ENV=development

export database_host=192.168.2.109
export database_dbname=sma
export database_user=postgres
export database_password=postgres

export dlab_pid_mongodb_uri=mongodb://mongodb:Mongodb2022@192.168.2.108:27017
export dlab_pid_mongodb_fechaminima=2023-05-01


flask run
