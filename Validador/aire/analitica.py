from aire.analytics.analytics import *
import json
import numbers
from flask import jsonify

def getList(data):
    list = []
    for i in data:
        if isinstance(i, numbers.Integral):
            i = int(i)
        list.append(i)
    return list

def cantidad_datos(fechas, values):  
    return fechas, pd.to_numeric(values)

def generaAnalitica(analiticas, dataFrame):
    X = dataFrame['fecha'].dt.strftime('%Y-%m-%d %H:%M:%S')
    X = getList(X.values)
    data = []
    result = {'X': X, 'data': data}
    data.append({'name': 'Data', 'Y': getList(pd.to_numeric(dataFrame['valor'].values))})

    for analitica in analiticas:
        funcion = analitica['funcion']
        fn = globals()[funcion]
        resultFn = fn(dataFrame['fecha'].values, dataFrame['valor'].values)
        #print(analitica['descripcion'], resultFn[1])
        data.append({'name': analitica['descripcion'],  'Y': getList(resultFn[1])})
    return result

