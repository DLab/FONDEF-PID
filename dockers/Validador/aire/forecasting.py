import pandas as pd
import statsmodels.api as sm
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from pandas import to_datetime, date_range, to_timedelta
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler



def arima(parametros, df, additionalData):
    #p = 35, d = 3, q = 5, forecast_steps = 25):
    timestamp = pd.to_datetime(df["fecha"]).values
    data = df["valor"].astype(float).values
    
    p = additionalData[0]
    d = additionalData[1]
    q = additionalData[2]
    forecast_steps = additionalData[3]
        
    """Calculate the Seasonal Decompose with Additive method

    Args:
        timestamp   :   A list of timestamps corresponding to the data.
        data        :   A list of data points.
        p           :   order of the AR term
        d           :   order of the MA term
        q           :   number of differences required to make the time series stationary
        forecast_steps  :
                        number of steps to predict

    Returns:
        dt_forecast :   a list of timestamp corresponding to prediction points
        forecast    :   a list with the data predicted
    """

    X   =   pd.to_datetime(timestamp)
    Y   =   data

    ts  =   pd.Series(Y, index=X)
    ts  =   ts.sort_index()

    model       = ARIMA(ts.values, order=(p, d, q))
    model_fit   = model.fit()

    forecast    = model_fit.forecast(steps=forecast_steps)
    last_date   = X[-1]

    frequency   = '1H'
    dt_forecast = pd.date_range(start=last_date, periods=forecast_steps+1, freq=frequency)

    forecast    = [Y[-1]] + forecast.tolist()
    dt_forecast = dt_forecast.strftime('%Y-%m-%d %H:%M:%S').tolist()

    return dt_forecast, forecast


def sarima(parametros, df, additionalData):
    #p = 10, d = 1, q = 1, P = 1, D = 1, Q = 1, s = 24, forecast_steps = 25):
    timestamp = pd.to_datetime(df["fecha"]).values
    data = df["valor"].astype(float).values
    p = additionalData[0]
    d = additionalData[1]
    q = additionalData[2]
    P = additionalData[3]
    D = additionalData[4]
    Q = additionalData[5]
    s = additionalData[6]
    forecast_steps = additionalData[7]
    
    if (p >= s):
        return {'ERROR': 'Orden del término AR  debe ser menor que la duración del período estacional'}

    """Calculate the Seasonal Decompose with Additive method

    Args:
        timestamp   :   A list of timestamps corresponding to the data.
        data        :   A list of data points.
        p           :   order of the AR term
        d           :   order of the I term
        q           :   order of the MA term
        P           :   order of the seasonal AR term
        D           :   order of the seasonal I term
        Q           :   order of the seasonal MA term
        s           :   length of the seasonal period
        forecast_steps: number of steps to forecast

    Returns:
        dt_forecast :   a list of timestamp corresponding to prediction points
        forecast    :   a list with the data predicted
    """

    X   = pd.to_datetime(timestamp)
    Y   = data

    ts  = pd.Series(Y, index=X)
    ts  = ts.sort_index()

    model       = SARIMAX(ts.values, order=(p, d, q), seasonal_order=(P, D, Q, s))
    model_fit   = model.fit()

    forecast    = model_fit.forecast(steps=forecast_steps)
    last_date   = X[-1]

    frequency   = '1H'
    dt_forecast = pd.date_range(start=last_date, periods=forecast_steps + 1, freq=frequency)

    forecast    = [Y[-1]] + forecast.tolist()
    dt_forecast = dt_forecast.strftime('%Y-%m-%d %H:%M:%S').tolist()

    return dt_forecast, forecast



def LSTM(parametros, data, additionalData):
    largo_prediccion = additionalData[0]
    parametro = parametros[2]
    termino = data.iloc[-1]['fecha']
    print('fecha termino:', termino, 'largo_prediccion', largo_prediccion)
    
    if(parametro != 'PM10'):
        return {'ERROR': 'No se encuentra el modelo LSTM para predecir {}'.format(parametro)}
    # Cargamos el modelo ya entrenado. Modificar ruta si es necesario
    model = keras.models.load_model('aire/model.keras')
    data.fecha = to_datetime(data.fecha)
    data['valor'] = data['valor'].astype('float32')
    lastValue = data.iloc[-1]['valor']
    print('lastvalue', lastValue)
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
        real_data = data[fin-(n_input+largo_prediccion):fin]
        input_seq = data[fin-(n_input+largo_prediccion):fin-largo_prediccion]
        forecast = []
        for _ in range(largo_prediccion):  # Predict next 24 hours
            prediction = model.predict(input_seq[np.newaxis, :, :])
            forecast.append(prediction)
            input_seq = np.roll(input_seq, -1)
            input_seq[-1] = np.append(prediction, input_seq[-2, 1:]) 
    timestamp = date_range(to_datetime(termino) - to_timedelta('1d'), periods=largo_prediccion, freq='1H')
    prediction = scaler.inverse_transform(np.array(forecast).reshape(-1,1))
    prediction = np.insert(prediction, 0, np.array(lastValue))
    print(prediction)
    return timestamp, prediction


