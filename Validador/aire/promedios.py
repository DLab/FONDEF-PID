from aire.promedios_por_hora import promedios
from datetime import datetime, timedelta
from connect_db import getMongoConnection, getConnect, getProperty
from aire.limpieza_y_validacion_pandas import validaLimpia
from notificaciones import notificar
import pandas as pd
import numpy as np
import json
import gc


def getHour(hora:str):
    if (len(hora) == 1):
        return '0' + hora + ':00:00'
    return hora + ':00:00'

def getPropertyValue(object, property):
    try:
        return object[property].strip()
    except:
        return 'nan'

def getLimites():
    with getConnect() as con:
        cur = con.cursor()
        cur.execute("select lmt_rgd_id, lmt_est_id, lmt_dispositivo, lmt_parametro, lmt_unidad_medida, lmt_minimo, lmt_maximo from limites_aire")
        result = cur.fetchall()
        cur.close()
        obj = {}
        for r in result:
            id = str(r[0]) + '_' + str(r[1]) + '_' + str(r[2]) + '_' + r[3];
            obj[id] = {'unidad': r[4], 'minimo': r[5], 'maximo': r[6]}
        
        return obj

class Item():
    def __init__(self, ufId, procesoId, dispositivoId, parametro, valor, unidad, fecha, tipoDato):
        self.id= str(ufId) + '_' + str(procesoId) + '_' + parametro + '_' + fecha.strftime('%Y%m%d%H%M%S')
        self.idLimite = str(ufId) + '_' + str(procesoId) + '_' + str(dispositivoId) + '_' + parametro
        self.ufId = ufId
        self.valor = valor
        self.unidad = unidad
        self.procesoId = procesoId
        self.dispositivoId = dispositivoId
        self.parametro = parametro
        self.fecha = fecha
        self.tipoDato = tipoDato

class Limite():
    
    def __init__(self):
        self.limites = getLimites()
        self.notificaciones = {}
        
    def validaLimite(self, obj, notifica):
        try:
            values = self.limites[obj.idLimite]
            if (values != None):
                if (values['unidad'] != obj.unidad):
                    if (notifica):
                        self.notificaciones[obj.id] = {'error': 'Unidad de medida no corresponde', 'limite': values, 'obj': obj}
                    return False
                elif (obj.valor < values['minimo']):
                    if (notifica):
                        self.notificaciones[obj.id] = {'error': 'Valor es menor que el mínimo permitido', 'limite': values, 'obj': obj}
                    return False
                elif (obj.valor > values['maximo']):
                    if (notifica):
                        self.notificaciones[obj.id] = {'error': 'Valor es mayor que el máximo permitido', 'limite': values, 'obj': obj}
                    return False
                else:
                    self.notificaciones[obj.id] = None
            return True
        except:
            return True
    
    def notificar(self):
        for p in self.notificaciones:
            #print(p, self.notificaciones[p])
            val = self.notificaciones[p]
            if (val != None):
                #print(val['obj'].__dict__)
                notificar('LIMITE', val['error'], val['limite'], val['obj'])
                
def addMonth(fecha):
    t = fecha.strftime('%Y-%m-%d').split('-')
    mes = int(t[1])
    agno = int(t[0])
    if (mes == 12):
        return datetime.strptime(str(agno + 1) + '-01-01 00:00:00', '%Y-%m-%d %H:%M:%S')
    else:
        return datetime.strptime(t[0] + '-' + str(mes + 1) + '-01 00:00:00', '%Y-%m-%d %H:%M:%S')
        
def guadarPromedios(fechaInicial, fechaFinal, property, data):
    with getConnect() as con:
        print('guarda registros para', fechaInicial, fechaFinal, flush=True)
        cur = con.cursor()
        cur.execute("delete from datos_promedios where dpr_tipo = %s and dpr_fecha >= %s and dpr_fecha < %s", [property, fechaInicial.strftime('%Y-%m-%d %H:%M:%S'), fechaFinal.strftime('%Y-%m-%d %H:%M:%S')])
        cur.close()

        cur = con.cursor()
        print('nro de registros:', len(data), flush=True)
        #n = 0
        #for index, row in data.iterrows():
        #    n += 1
        #    print(n, 'registro', row.UfId, row.ProcesoId, row.fecha.strftime('%Y-%m-%d %H:%M:%S'), row.parametro, row.valor)
        
        n = 0
        for index, row in data.iterrows():
            n += 1
            try:
                cur.execute("insert into datos_promedios (dpr_bdt_codigo, dpr_ufid, dpr_idproceso, dpr_fecha, dpr_prm_codigo, dpr_valor, dpr_cantidad, dpr_tipo) values (%s, %s, %s, %s, %s, %s, %s, %s)", ['AIRE', row.UfId, row.ProcesoId, row.fecha.strftime('%Y-%m-%d %H:%M:%S'), row.parametro, row.valor, row.dataPoint_count, property])
            except (Exception) as error:
                print(n, 'ERROR en ', row.UfId, row.ProcesoId, row.fecha.strftime('%Y-%m-%d %H:%M:%S'), row.parametro, row.valor, row.dataPoint_count, property)
                raise error
        cur.close()

def initArray():
    return {'crudos': [], 'validados': [], 'mixtos': []}

def addValue(property, ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos, tipoDato, obj):
    ufIds[property].append(obj.ufId)
    ProcesoId[property].append(obj.procesoId)
    dispositivoId[property].append(obj.dispositivoId)
    parametro[property].append(obj.parametro)
    valor[property].append(obj.valor)
    unidad[property].append(obj.unidad)
    fecha[property].append(obj.fecha)
    tiposDatos[property].append(tipoDato)
    
def _processData(property, fechaInicial, fechaFinal, dataFrame):
    print('entrada', property, len(dataFrame), flush=True)
    dataFrame = dataFrame.dropna()
    print('se sacan los limites', property, len(dataFrame))
    #dataFrame = validaLimpia(dataFrame)
    #print('limpios', property, len(dataFrame))
    dataFrame = promedios(dataFrame)
    print('salida', property, len(dataFrame), flush=True)
    guadarPromedios(fechaInicial, fechaFinal, property, dataFrame)
    print('guarda ok', property, flush=True)

def processData(property, fechaInicial, fechaFinal, ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos):
    if len(ufIds[property]) > 0:
        dataFrame = pd.DataFrame({'UfId': ufIds[property], 'ProcesoId': ProcesoId[property], 'dispositivoId': dispositivoId[property]
                             , 'parametro' : parametro[property], 'valor': valor[property], 'unidad' : unidad[property]
                             , 'fecha': fecha[property], 'tipoDato': tiposDatos[property]})
        _processData(fechaInicial, fechaFinal, dataFrame)
    
def calculaPromedios(db, fechaInicial, fechaFinal, allRecords):
    print('CALCULANDO promedios para:', datetime.now(), fechaInicial, fechaFinal, flush=True)
    #rows = []
    mes = fechaInicial.strftime('%m')
    cursor = db.CA_ApiRest.find({'timestamp': { '$gte': fechaInicial, '$lt': fechaFinal } })
    print('retorna consulta', datetime.now())
    ufIds = initArray()
    ProcesoId = initArray()
    dispositivoId = initArray()
    parametro = initArray()
    valor = initArray()
    unidad = initArray()
    fecha = initArray()
    tiposDatos = initArray()
    objects = {}
    n = 0
    limites = Limite()
    for doc in cursor:
        for data in doc['data']:
            for param in data['Parametros']:
                n = n + 1
                
                estampaTiempo = param['estampaTiempo']
                if (allRecords == False):
                    if (mes != estampaTiempo.strftime('%m')):
                        continue
                
                crudo = getPropertyValue(param, 'Crudo')
                validado = getPropertyValue(param, 'Validados')
                if (crudo == 'DC' or validado == 'DV'):

                    tipoDato = None
                    obj = Item(doc['UfId'], doc['ProcesoId'], data['dispositivoId'], param['nombre'], param['valor'], param['unidad'], estampaTiempo, tipoDato)
                    if (validado != 'nan'):
                        tipoDato = validado
                        obj.tipoDato = tipoDato
                        limites.validaLimite(obj, True)
                        addValue('validados', ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos, tipoDato, obj)
                        try:
                            index = objects[obj.id]
                            ufIds['mixtos'][index] = obj.ufId
                            ProcesoId['mixtos'][index] = obj.procesoId
                            dispositivoId['mixtos'][index] = obj.dispositivoId
                            parametro['mixtos'][index] = obj.parametro
                            valor['mixtos'][index] = obj.valor
                            unidad['mixtos'][index] = obj.unidad
                            fecha['mixtos'][index] = obj.fecha
                            tiposDatos['mixtos'][index] = tipoDato
                            continue
                        except:
                            objects[obj.id] = len(ufIds['mixtos'])

                    else: #datos crudo
                        tipoDato = crudo
                        obj.tipoDato = tipoDato
                        limites.validaLimite(obj, False)
                        addValue('crudos', ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos, tipoDato, obj)
                        
                        try:
                            index = objects[obj.id]
                            continue
                        except:
                            objects[obj.id] = len(ufIds['mixtos'])
                            
                    addValue('mixtos', ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos, tipoDato, obj)
                        
    limites.notificar()
    if (allRecords == False):
        fechaFinal = addMonth(fechaInicial)
    print('total de registros leidos:', n)
    processData('mixtos', fechaInicial, fechaFinal, ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos)
    processData('crudos', fechaInicial, fechaFinal, ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos)
    processData('validados', fechaInicial, fechaFinal, ufIds, ProcesoId, dispositivoId, parametro, valor, unidad, fecha, tiposDatos)
    return 'OK'

def calculaPromediosPorHora(fecha:str, hora:str):
    print(hora)
    fechaInicial = None
    fechaFinal = None
    
    if (hora == ''):
        fechaFinal = datetime.strptime(fecha + ' 00:00:00', '%Y-%m-%d %H:%M:%S') + timedelta(days=1)
    else:
        fechaFinal = datetime.strptime(fecha + ' ' + getHour(hora), '%Y-%m-%d %H:%M:%S') + timedelta(hours=1)
    t = fechaFinal.strftime('%Y-%m-%d').split('-')
    day = int(t[2])
    if (day > 15):
        fechaInicial = datetime.strptime(t[0] + '-' + t[1] + '-01 00:00:00', '%Y-%m-%d %H:%M:%S')
    else:
        mes = int(t[1])
        if (mes == 1):
            fechaInicial = datetime.strptime(str(int(t[0]) - 1) + '-12-01 00:00:00', '%Y-%m-%d %H:%M:%S')
        else:
            fechaInicial = datetime.strptime(t[0] + '-' + str(mes - 1) + '-01 00:00:00', '%Y-%m-%d %H:%M:%S')
        
    with getMongoConnection() as mongo:
        db = mongo.ExportData
        return calculaPromedios(db, fechaInicial, fechaFinal, True)
        
def calculaUltimosPromedios():    
    with getConnect() as conn:
        cur = conn.cursor()
        cur.execute("SELECT max(dpr_fecha) as fecha from datos_promedios")
        fechas = cur.fetchone()
        cur.close()
        fecha = fechas[0]
        if fecha == None:
            fecha = datetime.strptime(getProperty('MongoDatabaseSection', 'dlab.pid.mongodb.fechaminima') + ' 00:00:00', '%Y-%m-%d %H:%M:%S')
        else:
            fecha = datetime.strptime(fecha.strip(), '%Y-%m-%d %H:%M:%S')
        fecha = fecha + timedelta(hours=1)
        t = fecha.strftime('%Y-%m-%d').split('-')
        fecha = datetime.strptime(t[0] + '-' + t[1] + '-01 00:00:00', '%Y-%m-%d %H:%M:%S')
        now = datetime.now()
        print(fecha, now)
        with getMongoConnection() as mongo:
            db = mongo.ExportData
            while fecha < now:
                fechaInicial = fecha
                fecha = addMonth(fecha)
                calculaPromedios(db, fechaInicial, fecha + timedelta(days=15), False)
    return 'OK'
                    
def generaPromedios(params):
    path = params['data']
    print(path)
    f = open(path)
    data = json.load(f)['data']
    fechas = []
    fechaInicio = datetime.strptime(data['fechaInicio'], '%Y-%m-%d %H:%M:%S')
    fechaTermino = datetime.strptime(data['fechaTermino'], '%Y-%m-%d %H:%M:%S')
    tipo = data['tipo']
    for f in data['fecha']:
        fechas.append(datetime.strptime(f, '%Y-%m-%d %H:%M:%S'))

    if len(fechas) > 0:
        dataFrame = pd.DataFrame({'UfId': data['ufIds'], 'ProcesoId': data['procesoId'], 'dispositivoId': data['dispositivoId']
                             , 'parametro' : data['parametro'], 'valor': data['valor'], 'unidad' : data['unidad']
                             , 'fecha': fechas, 'tipoDato': data['tiposDatos']})
        _processData(tipo, fechaInicio, fechaTermino, dataFrame)
    
    print("objectos recolectados:", gc.collect())