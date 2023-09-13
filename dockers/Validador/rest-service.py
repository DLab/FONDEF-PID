import pandas as pd
from flask import Flask, request, jsonify
from validador import valida_archivo
from aire.promedios import calculaPromediosPorHora, calculaUltimosPromedios, generaPromedios
from aire.analitica import generaAnalitica
from aire.analiticaIA import generaAnaliticaIA
from aire.validaciones_normativas import valida_normativas_aire, valida_normativas_aire_trianual
from connect_db import getConnect
from pandas import DataFrame
from valida_limites import validaLimitesChile


app = Flask(__name__)

@app.post("/validaArchivo")
def validaArchivo():
    errores = valida_archivo(request.get_json(True))
    return jsonify(errores)

def getUnidadMedidad(conn, data):
    cur = conn.cursor()   
    params = [data['tipoDato'], data['regulado'], data['estacion'], data['fuente']]     
    cur.execute("SELECT dpe_unidad_medida from datos_por_estacion where dpe_prm_codigo = %s and dpe_rgd_id = %s and dpe_est_id = %s  and  dpe_tpo_codigo = %s ", params)
    reg = cur.fetchone()
    return reg[0]
    
@app.post("/analitica")
def analitica():
    data = request.get_json(True)
    print(data)
    with getConnect() as conn:
        cur = conn.cursor()        
        params = [data['inicio'], data['termino'], data['tipoDato'], data['regulado'], data['estacion'], data['fuente']]
        cur.execute("SELECT dpr_ufid, dpr_idproceso, dpr_fecha, dpr_prm_codigo, dpr_valor from datos_promedios where dpr_fecha >= %s and dpr_fecha < %s and dpr_prm_codigo = %s and dpr_ufid = %s and dpr_idproceso = %s  and  dpr_tipo = %s order by dpr_fecha asc", params)
        df = DataFrame(cur.fetchall())
        cur.close()      
        if (len(df) > 0):
            df.columns = ['ufId', 'idProceso', 'fecha', 'parametro', 'valor']
            df["fecha"] = pd.to_datetime(df["fecha"]) 
            return generaAnalitica(params, data['analitica'], data['additionalData'], df, getUnidadMedidad(conn, data))
        else:
            return {'ERROR': 'NODATA'}


@app.post("/analiticaIA")
def analiticaIA():
    data = request.get_json(True)
    print(data)
    with getConnect() as conn:
        cur = conn.cursor()
        params = [data['inicio'], data['termino'], data['tipoDato'], data['regulado'], data['estacion'], data['fuente']]
        cur.execute("SELECT dpr_ufid, dpr_idproceso, dpr_fecha, dpr_prm_codigo, dpr_valor from datos_promedios where dpr_fecha >= %s and dpr_fecha < %s and dpr_prm_codigo = %s and dpr_ufid = %s and dpr_idproceso = %s  and  dpr_tipo = %s order by dpr_fecha asc", params)
        df = DataFrame(cur.fetchall())
        cur.close()        
        if (len(df) == 0):
            return {'ERROR': 'NODATA'}

        df.columns = ['ufId', 'idProceso', 'fecha', 'parametro', 'valor']
        return generaAnaliticaIA(params, data['analitica'], data['additionalData'], df, getUnidadMedidad(conn, data))

#los parámetros de entrada solo para aire: fecha, hora (0-23)
#dataframe, ufid, idproceso, fecha timestamp, parametro, valor
# los datos son: ufid, idProceso, fecha timestamp, parametro, valor
@app.route("/promediosPorHora")
def promediosPorHora():
    return jsonify(calculaPromediosPorHora(request.args.get('fecha'), request.args.get('hora')))

@app.get("/ultimosPromedios")
def promediosActuales():
    return calculaUltimosPromedios()
                

@app.get("/validacionesNormativasAire")
def validacionesNormativasAire():
    print('entra')
    return valida_normativas_aire(request.args.get('agno'))

@app.get("/validacionesNormativasAireTrianual")
def validacionesNormativasAireTrianual():
    return valida_normativas_aire_trianual(request.args.get('agno'))

@app.get("/getRangoDatosxUfId")
def getRangoDatosxUfId():
    with getConnect() as conn:
        cur = conn.cursor()
        cur.execute("select dpr_ufId, dpr_idproceso, min(dpr_fecha) fechaInicio, max(dpr_fecha) fechaTermino from datos_promedios group by dpr_ufId, dpr_idproceso")
        data = cur.fetchall()
        cur.close()   
        result = []     
        for d in data:
            result.push({'ufId': d[0], 'provcesoId': d[1], 'fechaInicio': d[2], 'fechaTermino': d[3], })
        return result

@app.post("/calculaPromedios")
def calculaPromedios():
    errores = generaPromedios(request.get_json(True))
    return jsonify(errores)

@app.post("/validaLimites")
def validaLimites():
    errores = validaLimitesChile(request.get_json(True))
    return jsonify(errores)

