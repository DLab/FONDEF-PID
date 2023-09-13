from aire.analytics.analytics import *
from aire.analiticaIA import *
import numbers
import numpy as np
import pandas as pd
from pandas import DataFrame
from connect_db import getConnect

def getList(data):
    list = []
    for i in data:
        if (isinstance(i, np.ndarray)):
            i = float(i[0])
            print(i)
        if isinstance(i, float) and np.isnan(i):
            i = 'nan'
        elif isinstance(i, numbers.Integral):
            i = int(i)
        list.append(i)
    return list

def cantidad_datos(fechas, values):  
    return fechas, pd.to_numeric(values)

def getData(params):
    with getConnect() as conn:
        cur = conn.cursor()        
        cur.execute("SELECT dpr_valor from datos_promedios where dpr_fecha >= %s and dpr_fecha < %s and dpr_prm_codigo = %s and dpr_ufid = %s and dpr_idproceso = %s  and  dpr_tipo = %s order by dpr_fecha asc", params)
        df = DataFrame(cur.fetchall())
        cur.close()      
        if (len(df) > 0):
            df.columns = ['valor']
            return df['valor'].values
        return None
    
def generaAnalitica(params, analiticas, additionalData, dataFrame, unidadMedida):
    X = dataFrame['fecha'].dt.strftime('%Y-%m-%d %H:%M:%S')
    X = getList(X.values)
    data = []
    result = {'X': X, 'data': data, 'unidadMedida': unidadMedida}
    data.append({'name': 'Data', 'Y': getList(pd.to_numeric(dataFrame['valor'].values))})

    index = 0
    for analitica in analiticas:
        funcion = analitica['funcion']
        fn = globals()[funcion]
        addData = additionalData[index]
        if (len(addData) > 0 and isinstance(addData[0], str)):
            params[2] = addData[0]
            param = addData[0]
            addData[0] = getData(params)
            data.append({'name': param, 'Y': getList(pd.to_numeric(addData[0]))})
            
        resultFn = fn(dataFrame['fecha'].values, dataFrame['valor'].values, addData)
        index = index + 1
        #print(analitica['descripcion'], resultFn[1])
        #data.append({'name': analitica['descripcion'],  'Y': getList(resultFn[1])})
        if (isinstance(resultFn, float)):
            data.append({'analitica': analitica['codigo'], 'data': resultFn})
        else:
            list = [];
            n = len(resultFn)
            for i in range(1, n):
                print('isinstabce', resultFn[i], isinstance(resultFn[i], float))
                if (isinstance(resultFn[i], float)):
                    list.append(resultFn[i])
                else:
                    list.append(getList(resultFn[i]))
            data.append({'analitica': analitica['codigo'], 'data': list})
    return result

