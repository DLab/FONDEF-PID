import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose
import statsmodels.api as sm
import numpy as np
from pyts.decomposition import SingularSpectrumAnalysis
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN





#-------------------------- DECOMPOSITION METHODS --------------------------#

def additive_seasonal_decompose(UfId, sensorId, timestamp, data, period = 100):

    """Calculate the Seasonal Decompose with Additive method

    Args:
        UfId        :   Unidad fiscalizada identifier.
        sensorId    :   Sensor identifier.
        timestamp   :   A list of timestamps corresponding to the data.
        data        :   A list of data points.
        period      :   Number of points in a period

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point
        decomposition, a variable composed by:
            decomposition.trend     :   time series with the trend
            decomposition.seasonal  :   time series with the periodicity
            decomposition.resid     :   time series with the noise
    """
    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    decomposition   =   sm.tsa.seasonal_decompose(time_series, model="additive", period=period)

    return UfId, sensorId, timestamp[-1], decomposition

def multiplicative_seasonal_decompose(UfId, sensorId, timestamp, data, period = 100):

    """Calculate the Seasonal Decompose with Multiplicative method

    Args:
        UfId        :   Unidad fiscalizada identifier.
        sensorId    :   Sensor identifier.
        timestamp   :   A list of timestamps corresponding to the data.
        data        :   A list of data points.
        period      :   Number of points in a period

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point
        decomposition, a variable composed by:
            decomposition.trend     :   time series with the trend
            decomposition.seasonal  :   time series with the periodicity
            decomposition.resid     :   time series with the noise
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    decomposition   =   sm.tsa.seasonal_decompose(time_series, model="multiplicative", period=period)

    return UfId, sensorId, timestamp[-1], decomposition

def singular_spectrum_analysis(UfId, sensorId, timestamp, data, window_size = 100, n_components = 2):

    """ Decomposing by a Singular Spectrum Analisys

    Args:
        UfId            :   Unidad fiscalizada identifier.
        sensorId        :   Sensor identifier.
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.
        window_size     :   Number of points in a window
        n_components    :   Number of principal components

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point
        components, a matrix with all principal components:
            components[n]   :   component of order n
    """
    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    data            =   time_series.values
    data            =   np.reshape(data, (1, -1))

    ssa             =   SingularSpectrumAnalysis(window_size=window_size, groups=n_components)
    components      =   ssa.fit_transform(data)

    return UfId, sensorId, timestamp[-1], components

#-------------------------- REGRESIONS --------------------------#

def linear_regression(timestamp, data):

    """ Calculate the linear trend

    Args:
        UfId            :   Unidad fiscalizada identifier.
        sensorId        :   Sensor identifier.
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point,
        linear_predict, a list with values of the linear trend
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    numeric_dates   =   pd.to_numeric(time_series.index)

    numeric_dates   =   numeric_dates.values.reshape(-1, 1)

    # create and fit with a linear regression model
    model   =   LinearRegression()
    model.fit(numeric_dates, time_series.values)

    linear_predict  =   model.predict(numeric_dates)
    return X, linear_predict



def polynomial_regression(UfId, sensorId, timestamp, data, order = 2):

    """ Calculate the linear trend

    Args:
        UfId            :   Unidad fiscalizada identifier.
        sensorId        :   Sensor identifier.
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point,
        poly_predict, a list with values of the polynomial trend
    """

    X   =   pd.to_datetime(timestamp, unit='s')
    Y   =   data

    time_series     =   pd.Series(Y, index=X)
    numeric_dates   =   pd.to_numeric(time_series.index)

    numeric_dates   =   numeric_dates.values.reshape(-1, 1)

    coefs           =   np.polyfit(numeric_dates.flatten(), Y, order)
    poly_predict    =   np.polyval(coefs, numeric_dates.flatten())

    return UfId, sensorId, timestamp[-1], poly_predict



#-------------------------- CLUSTERING METHODS --------------------------#

def kmeans_clustering(UfId, sensorId, timestamp, data, n_clusters = 2):

    """ Calculate the linear trend

    Args:
        UfId            :   Unidad fiscalizada identifier.
        sensorId        :   Sensor identifier.
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.
        n_clusters      :   Number of clusters

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point,
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

    return UfId, sensorId, timestamp[-1], clusters



def DBSCAN_clustering(UfId, sensorId, timestamp, data, eps = 0.5, min_samples = 100):

    """ Calculate the linear trend

    Args:
        UfId            :   Unidad fiscalizada identifier.
        sensorId        :   Sensor identifier.
        timestamp       :   A list of timestamps corresponding to the data.
        data            :   A list of data points.
        n_clusters      :   Number of clusters

    Returns:
        UfId,
        sensorId,
        timestamp of the last data point,
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

    return UfId, sensorId, timestamp[-1], clusters





















