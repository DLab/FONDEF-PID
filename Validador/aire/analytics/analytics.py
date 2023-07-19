import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.tsa.stattools import grangercausalitytests
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

def linear_regression(timestamp, data, additionalData):
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


def polynomial_regression(timestamp, data, additionalData):
    """ Calculate the linear trend

    Args:
        timestamp       :   A list of timestamps corresponding to the data
        data            :   A list of data points
        order           :   Polinomial order

    Returns:
        timestamp
        poly_predict, a list with values of the polynomial trend
    """
    order = additionalData[0]
    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    numeric_dates   =   pd.to_numeric(time_series.index)

    numeric_dates   =   numeric_dates.values.reshape(-1, 1)

    coefs           =   np.polyfit(numeric_dates.flatten(), pd.to_numeric(Y, downcast='float') , order)
    poly_predict    =   np.polyval(coefs, numeric_dates.flatten())

    return timestamp, poly_predict


def simple_moving_average(timestamp, data, additionalData):
    """Calculate the simple moving average of the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.
        window_size: The number of data points to include in each average.

    Returns:
        timestamp of the data, and the moving average of the data.
    """
    """window_size=3"""
    window_size = additionalData[0]
    data_series = pd.Series(data)
    moving_avg = data_series.rolling(window_size).mean().tolist()
    return timestamp, moving_avg

def exponential_moving_average(timestamp, data, additionalData):
    """Calculate the exponential moving average of the data.
    
    Args:
        timestamp: A list of timestamps corresponding to the data.
        data: A list of data points.
        span: The span for the exponential moving average.

    Returns:
        timestamp of the data, and the exponential moving average of the data.
    """
    span=additionalData[0]
    data_series = pd.Series(data, index=pd.to_datetime(timestamp))
    ema = data_series.ewm(span=span).mean().tolist()
    return timestamp, ema

'''
================= Autocorrelation =================
This section contains functions for autocorrelation.
- Autocorrelation
- Partial autocorrelation
'''

def autocorrelation(timestamp, data, additionalData):
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

def partial_autocorrelation(timestamp, data, additionalData):
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
    nlags = len(timestamp)
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
def statistical_process_control(timestamp, data, additionalData):
    """
    Perform Statistical Process Control (SPC) analysis on a dataset.

    This function calculates the mean and standard deviation of the data,
    and determines the Upper Control Limit (UCL) and Lower Control Limit (LCL) 
    as three standard deviations above and below the mean, respectively.
    It also identifies any points that fall outside these control limits.

    Args:
        timestamp
        data : array_like
        An array_like object containing the data to be analyzed. 
        Should be a one-dimensional collection of numerical values.

    Returns:
        timestamp: 
        data_mean : float
            The mean of the input data.
        UCL : float
            The Upper Control Limit, calculated as three standard deviations above the mean.
        LCL : float
            The Lower Control Limit, calculated as three standard deviations below the mean.
        out_of_control_points : list of tuple
            A list of tuples where each tuple contains the index and value of a data point 
            that falls outside the control limits.

    Examples
    --------
    >>> data = [1, 2, 3, 2, 1, 2, 3, 3, 5, 2, 1, 3, 2, 1]
    >>> statistical_process_control(data)
    (2.2142857142857144, 4.111799109552328, 0.31677231871910053, [(8, 5)])

    """
    # Calculate statistics
    data_mean = np.mean(data)
    data_std = np.std(data)

    # Control limits
    UCL = data_mean + 3 * data_std
    LCL = data_mean - 3 * data_std

    # Identify points that are out of control
    out_of_control_points = [(index, value) for index, value in enumerate(data) if value > UCL or value < LCL]

    return timestamp, data_mean, UCL, LCL, out_of_control_points


'''
================= Decomposition =================
This section contains functions for decomposition.
- Additive seasonal decompose
- Multiplicative seasonal decompose
- Singular spectrum analysis
'''
def additive_seasonal_decompose(timestamp, data, additionalData):

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
    period = additionalData[0]
    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    decomposition   =   sm.tsa.seasonal_decompose(time_series, model="additive", period=period)
  	

    trend       = decomposition.trend.values
    seasonal    = decomposition.seasonal.values
    residual    = decomposition.resid.values

    return timestamp, trend, seasonal, residual


def multiplicative_seasonal_decompose(timestamp, data, additionalData):

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
    period = additionalData[0]
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

def kmeans_clustering(timestamp, data, additionalData):

    """ Calculate the linear trend

    Args:
        timestamp       :   A list of timestamps corresponding to the data
        data            :   A list of data points
        n_clusters      :   Number of clusters

    Returns:
        timestamp
        clusters , a list of cluster labels associated with each point of data
    """
    n_clusters = additionalData[0]
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


def DBSCAN_clustering(timestamp, data, additionalData):
                      

    """ Calculate the linear trend

    Args:
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.
        eps = 0.5
        min_samples      :   min_samples 100

    Returns:
        timestamp
        clusters , a list of cluster labels associated with each point of data
    """
    eps = additionalData[0]
    min_samples = additionalData[1]
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

def granger_causality(timestamp, data1, additionalData):

    """ Calculate the Granger Causality

    Args:
        timestamp       :   A list of timestamps corresponding to the data.
        data1           :   A list of data of a variable 1
        data1           :   A list of data of a variable 2

    Returns:
        timestamp
        causality       :   percent predictability of variable 2 by variable 1
    """
    data2 = additionalData[0]

    data    = pd.DataFrame({'V1': data1, 'V2': data2})
    results = grangercausalitytests(data, maxlag=1, verbose=False)
    p_value = results[1][0]['ssr_ftest'][1]

    causality_percentage = (1 - p_value) * 100
    return causality_percentage