from aire.analytics.analytics import linear_regression
import json
from json import JSONEncoder
import numpy

class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)

def generaAnalitica(tipoAnalitica, dataFrame):
    if (tipoAnalitica == 'REGRESION_LINEAL_AIRE'):
        result = linear_regression(dataFrame['fecha'].values, dataFrame['valor'].values)
        print(result[0])
        X = dataFrame['fecha'].dt.strftime('%Y-%m-%d %H:%M:%S')
        X = json.dumps(X.values, cls=NumpyArrayEncoder)
        Y = json.dumps(result[1], cls=NumpyArrayEncoder)
        return {'X': X, 'Y': Y}
    return 'OK'