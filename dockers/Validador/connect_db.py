#import configparser
import psycopg2
from pymongo import MongoClient
import os

#config = configparser.RawConfigParser()
#config.read('app.config')

def getProperty(section, option):
    return os.getenv(option)

def getConnect():
    #return psycopg2.connect("host=" + config.get('DatabaseSection', 'database.host') 
    #                        + " dbname=" + config.get('DatabaseSection', 'database.dbname') 
    #                        + " user=" + config.get('DatabaseSection', 'database.user') 
    #                        + " password=" + config.get('DatabaseSection', 'database.password') )

    return psycopg2.connect("host=" + os.getenv('database_host') 
                            + " dbname=" + os.getenv('database_dbname') 
                            + " user=" + os.getenv('database_user') 
                            + " password=" + os.getenv('database_password') )

def getMongoConnection():
    return MongoClient(os.getenv('dlab_pid_mongodb_uri'))