from pandas import to_datetime, date_range
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import numbers
import pandas as pd
from aire.forecasting import *

def getList(data):
    list = []
    for i in data:
        if (isinstance(i, np.ndarray)):
            i = float(i[0])
        elif isinstance(i, np.float32):
            i = float(i)
        if isinstance(i, float) and np.isnan(i):
            i = 'nan'
        elif isinstance(i, numbers.Integral):
            i = int(i)
        list.append(i)
    return list


def generaAnaliticaIA(params, analiticas, additionalData, df, unidadMedida):
    index = 1
    data = []
    data.append({'name': 'Data', 'Y': getList(pd.to_numeric(df['valor'].values))})

    steps = additionalData[0]
    simulationSteps = steps[0] + steps[1]

    print(len(df))
    df = df.head(len(df) - steps[0])
    print(len(df))
    X = pd.to_datetime(df["fecha"]).dt.strftime('%Y-%m-%d %H:%M:%S')
    X = getList(X.values)
    
    maxPrediction = []
    prediction = []
    for i in range(1, len(df['valor'])):
        prediction.append('nan')
    
    for analitica in analiticas:
        funcion = analitica['funcion']
        fn = globals()[funcion]
        addData = additionalData[index]
        addData.append(simulationSteps)
        print('Ejecutando:', analitica['codigo'])    
        resultFn = fn(params, df, addData)
        if (len(resultFn) == 1):
            return resultFn
        if (len(maxPrediction) < len(resultFn[0])):
            maxPrediction = resultFn[0]
        
        index = index + 1
        if (isinstance(resultFn, float)):
            data.append({'analitica': analitica['codigo'], 'data': resultFn})
        else:
            list = []
            n = len(resultFn)
            for i in range(1, n):
                if (isinstance(resultFn[i], float)):
                    list.append(resultFn[i])
                else:
                    list.append(prediction + getList(resultFn[i]))
            data.append({'analitica': analitica['codigo'], 'data': list})

    
    return {'X': X + getList(maxPrediction), 'data': data, 'unidadMedida': unidadMedida}
