import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.tsa.stattools import acf, pacf
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.seasonal import seasonal_decompose
from pyts.decomposition import SingularSpectrumAnalysis
from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN



'''
================= Trend =================
This section contains functions for trend analysis.
- Linear regression
- Polynomial regression
- Simple moving average
- Exponential moving average
'''

def linear_regression(timestamp, data):
    """Perform linear regression on the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.

    Returns:
        timestamp of the data, and the fitted curve.
    """
    
    X = pd.to_datetime(timestamp, unit='s')
    Y = data
    
    # Transform time in seconds
    dates_seconds = (X - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s')
    X = dates_seconds.values.reshape(-1, 1)

    model = LinearRegression()
    model.fit(X, Y)

    # Calculate the fitted curve
    fitted_curve = model.predict(X)
    
    return timestamp, fitted_curve


def polynomial_regression(timestamp, data, order = 2):

    """ Calculate the linear trend

    Args:
        timestamp       :   A list of timestamps corresponding to the data
        data            :   A list of data points
        order           :   Polinomial order

    Returns:
        timestamp
        poly_predict, a list with values of the polynomial trend
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    numeric_dates   =   pd.to_numeric(time_series.index)

    numeric_dates   =   numeric_dates.values.reshape(-1, 1)

    coefs           =   np.polyfit(numeric_dates.flatten(), pd.to_numeric(Y, downcast='float') , order)
    poly_predict    =   np.polyval(coefs, numeric_dates.flatten())

    return timestamp, poly_predict


def simple_moving_average(timestamp, data, window_size=3):
    """Calculate the simple moving average of the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.
        window_size: The number of data points to include in each average.

    Returns:
        timestamp of the data, and the moving average of the data.
    """
    data_series = pd.Series(data)
    moving_avg = data_series.rolling(window_size).mean().tolist()
    return timestamp, moving_avg

def exponential_moving_average(timestamp, data, span=3):
    """Calculate the exponential moving average of the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.
        span: The span for the exponential moving average.

    Returns:
        timestamp of the data, and the exponential moving average of the data.
    """
    data_series = pd.Series(data, index=pd.to_datetime(timestamp))
    ema = data_series.ewm(span=span).mean().tolist()
    return timestamp, ema

'''
================= Autocorrelation =================
This section contains functions for autocorrelation.
- Autocorrelation
- Partial autocorrelation
'''

def autocorrelation(timestamp, data, nlags=None):
    """Calculate the autocorrelation of the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.

    Returns:
        timestamp of the data, and the autocorrelation of the data.
    """
    # Convert timestamps to pandas datetime index
    dt_index = pd.to_datetime(timestamp)
    
    # Convert Decimal to float
    data = [float(d) for d in data]

    # Create a time series with the data
    data_series = pd.Series(data, index=dt_index)
    
    # Calculate autocorrelation
    nlags = len(timestamp)
    autocorr, conf_int  = acf(data_series, nlags=nlags, alpha=0.05)
    # lower and upper confidence interval at 95%
    low_conf_int = conf_int[:, 0] - autocorr
    up_conf_int  = conf_int[:, 1] - autocorr
    # lag is the x axis
    lag = np.arange(0, len(autocorr))
    #return timestamp, {'name': 'autocorrelation', 'data': autocorr}
    #series.push({type: 'bar', barWidth: 1, smooth: true, name: e.name, data: e.Y});
    #series = [{'type': 'scatter', 'symbol': 'circle', 'symbolSize': 10, 'smooth': True, 'name': 'autocorrelation', 'data': autocorr}
    #        , {'type': 'bar', 'barWidth': 1, 'smooth': True, 'name': 'autocorrelation', 'data': autocorr}]
    return timestamp, up_conf_int, low_conf_int, autocorr
    #return lag, autocorr, low_conf_int, up_conf_int

def partial_autocorrelation(timestamp, data, nlags=None):
    """Calculate the partial autocorrelation of the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.

    Returns:
        timestamp of the data, and the partial autocorrelation of the data.
    """
    # Convert timestamps to pandas datetime index
    dt_index = pd.to_datetime(timestamp)
    
    # Create a time series with the data
    data_series = pd.Series(data, index=dt_index)
    
    # Calculate partial autocorrelation
    partial_autocorr, conf_int = pacf(data_series, nlags=nlags, alpha=0.05)
    # lower and upper confidence interval at 95%
    low_conf_int = conf_int[:, 0] - partial_autocorr
    up_conf_int  = conf_int[:, 1] - partial_autocorr
    # lag is the x axis
    #lag = np.arange(0, len(partial_autocorr))
    lag = [element[0:len(partial_autocorr)] for element in  timestamp]
    return lag, partial_autocorr, low_conf_int, up_conf_int
    #return timestamp, {'name': 'partial_autocorrelation', 'data': partial_autocorr}

'''
================= Anomaly detection =================
This section contains functions for anomaly detection.
- Statistical process control
'''
def statistical_process_control(timestamp, data):
    """
    This function generates a control chart.
    
    Args:
    timestamp: The timestamps associated with the data.
    data: The data to be used in the control chart.

    Returns:
    tuple: A tuple containing the timestamp, and the control chart.
    """
    return timestamp, data

'''
================= Decomposition =================
This section contains functions for decomposition.
- Additive seasonal decompose
- Multiplicative seasonal decompose
- Singular spectrum analysis
'''
def additive_seasonal_decompose(timestamp, data, period = 100):

    """Calculate the Seasonal Decompose with Additive method

    Args:
        timestamp   :   A list of timestamps corresponding to the data.
        data        :   A list of data points.
        period      :   Number of points in a period

    Returns:
        timestamp
        trend     :   time series with the trend
        seasonal  :   time series with the periodicity
        resid     :   time series with the noise
    """
    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    decomposition   =   sm.tsa.seasonal_decompose(time_series, model="additive", period=period)
  	

    trend       = decomposition.trend.values
    seasonal    = decomposition.seasonal.values
    residual    = decomposition.resid.values

    return timestamp, trend, seasonal, residual


def multiplicative_seasonal_decompose(timestamp, data, period = 100):

    """Calculate the Seasonal Decompose with Additive method

    Args:
        timestamp   :   A list of timestamps corresponding to the data.
        data        :   A list of data points.
        period      :   Number of points in a period

    Returns:
        timestamp
        trend     :   time series with the trend
        seasonal  :   time series with the periodicity
        resid     :   time series with the noise
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    decomposition   =   sm.tsa.seasonal_decompose(time_series, model="multiplicative", period=period)

    trend       = decomposition.trend.values
    seasonal    = decomposition.seasonal.values
    residual    = decomposition.resid.values

    return timestamp, trend, seasonal, residual
'''
================= Clustering =================
This section contains functions for clustering.
- Kmeans clustering
- DBSCAN clustering
'''

def kmeans_clustering(timestamp, data, n_clusters = 2):

    """ Calculate the linear trend

    Args:
        timestamp       :   A list of timestamps corresponding to the data
        data            :   A list of data points
        n_clusters      :   Number of clusters

    Returns:
        timestamp
        clusters , a list of cluster labels associated with each point of data
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series = pd.Series(Y, index=X)

    # Prepare the data
    X       =   time_series.index.values.astype(float).reshape(-1, 1)
    Y       =   time_series.values.astype(float).reshape(-1, 1)
    points  =   np.concatenate((X, Y), axis=1)

    # Apply the clustering algorithm (k-means)
    kmeans      =   KMeans(n_clusters=n_clusters)
    clusters    =   kmeans.fit_predict(points)

    return timestamp, clusters


def DBSCAN_clustering(timestamp, data, eps = 0.5, min_samples = 100):

    """ Calculate the linear trend

    Args:
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.
        n_clusters      :   Number of clusters

    Returns:
        timestamp
        clusters , a list of cluster labels associated with each point of data
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series = pd.Series(Y, index=X)

    # Prepare the data
    X = time_series.values.reshape(-1, 1)

    # Apply DBSCAN clustering
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    clusters = dbscan.fit_predict(X)

    return timestamp, clusters

'''
================= Causality =================
This section contains functions for causality.
- Granger causality
'''
def granger_causality():
    pass
