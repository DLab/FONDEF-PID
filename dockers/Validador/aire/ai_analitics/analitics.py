from pandas import to_datetime, date_range
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
import numpy as np

def generaAnaliticaIA(termino, largo_prediccion, parametro, ufId, dataFrame):
    #print(dataFrame)
    if(parametro != 'PM10'):
        return 'No se encuentra el modelo para predecir {}'.format(parametro)
    # Cargamos el modelo ya entrenado. Modificar ruta si es necesario
    model = keras.models.load_model('model.keras')
    # Seleccionamos la ufId a predecir
    data = dataFrame[dataFrame.ufId == ufId].copy()
    data.fecha = to_datetime(data.fecha)
    data['valor'] = data['valor'].astype('float32')
    # Seleccionamos el parametro 
    pdata = data[data.parametro == parametro].drop(columns=['idProceso','parametro','ufId'])
    pdata.fillna(.0, inplace=True)
    # Transformamos la fecha en indice
    pdata = pdata.pivot_table(index=['fecha'], values='valor')
    scaler = MinMaxScaler(feature_range=(0, 1))
    data = scaler.fit_transform(pdata)
    
    n_input = model.input_shape[1]
    n_features = model.input_shape[2]
    if(data.shape[1] != n_features):
        return 'Número de variables incompatible con la red neuronal. Se esperan {} variables'.format(n_features)
    else:
        try:
            fin = pdata.index.get_loc(to_datetime(termino))
        except:
            return 'Fecha {} no encontrada en los datos'.format(termino)
        input_seq = data[fin-n_input:fin]
        forecast = []
        for _ in range(largo_prediccion):  # Predict next 24 hours
            prediction = model.predict(input_seq[np.newaxis, :, :])
            forecast.append(prediction)
            input_seq = np.roll(input_seq, -1)
            input_seq[-1] = np.append(prediction, input_seq[-2, 1:]) 
    return pdata.iloc[fin-n_input:fin].index, scaler.inverse_transform(input_seq), date_range(to_datetime(termino), periods=largo_prediccion, freq='1H') , scaler.inverse_transform(np.array(forecast).reshape(-1,1))
    #return 'OK'
